const DEFAULT_JUDGE0_URL = "https://ce.judge0.com";
const PYTHON_LANGUAGE_ID = 100;
const MAX_CODE_LENGTH = 20_000;
const MAX_CASES = 5;
const MAX_TEXT_LENGTH = 10_000;
const OUTPUT_LIMIT = 4_000;
const REQUEST_TIMEOUT_MS = 20_000;

export type PublicSampleCase = {
  input: string;
  expectedOutput: string;
};

export type SampleRunResult = {
  passed: boolean;
  status: "passed" | "wrong_answer" | "runtime_error" | "timeout" | "error";
  stdout: string;
  stderr: string;
};

type Judge0Submission = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  status?: { id?: number };
};

export function validatePythonRun(body: unknown): {
  code: string;
  cases: PublicSampleCase[];
} {
  if (!body || typeof body !== "object") {
    throw new Error("Send a JSON object with Python code and sample cases.");
  }

  const record = body as Record<string, unknown>;
  if (record.language !== "python") {
    throw new Error("Only Python can be executed.");
  }
  if (typeof record.code !== "string" || record.code.trim().length === 0) {
    throw new Error("Add some Python code before running it.");
  }
  if (record.code.length > MAX_CODE_LENGTH) {
    throw new Error("That program is too long to run.");
  }
  if (!Array.isArray(record.cases) || record.cases.length === 0) {
    throw new Error("A public sample case is required.");
  }
  if (record.cases.length > MAX_CASES) {
    throw new Error("Only the first few public sample cases can be run.");
  }

  const cases = record.cases.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("Each sample case needs input and expected output.");
    }
    const sample = item as Record<string, unknown>;
    if (typeof sample.input !== "string" || typeof sample.expectedOutput !== "string") {
      throw new Error("Sample input and expected output must be text.");
    }
    if (
      sample.input.length > MAX_TEXT_LENGTH ||
      sample.expectedOutput.length > MAX_TEXT_LENGTH
    ) {
      throw new Error("A sample case is too large to run.");
    }
    return { input: sample.input, expectedOutput: sample.expectedOutput };
  });

  return { code: record.code, cases };
}

function clip(value: string) {
  if (value.length <= OUTPUT_LIMIT) return value;
  return `${value.slice(0, OUTPUT_LIMIT)}\n... output truncated`;
}

function normalize(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function sameOutput(actual: string, expected: string) {
  const left = normalize(actual);
  const right = normalize(expected);
  if (left === right) return true;

  if (/^(true|false)$/i.test(left) && /^(true|false)$/i.test(right)) {
    return left.toLowerCase() === right.toLowerCase();
  }

  if (
    /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(left) &&
    /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(right)
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return Number.isFinite(leftNumber) && leftNumber === rightNumber;
  }

  return false;
}

function runnerBaseUrl() {
  const configured = process.env.JUDGE0_API_URL?.trim();
  return (configured || DEFAULT_JUDGE0_URL).replace(/\/$/, "");
}

export async function runPythonSample(
  code: string,
  sample: PublicSampleCase,
): Promise<SampleRunResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const apiKey = process.env.JUDGE0_API_KEY?.trim();
  if (apiKey) headers["X-Auth-Token"] = apiKey;

  let response: Response;
  try {
    response = await fetch(
      `${runnerBaseUrl()}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          source_code: code,
          language_id: PYTHON_LANGUAGE_ID,
          stdin: sample.input,
          cpu_time_limit: 2,
          wall_time_limit: 5,
          memory_limit: 128000,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return {
        passed: false,
        status: "timeout",
        stdout: "",
        stderr: "The Python runner took too long to respond.",
      };
    }
    return {
      passed: false,
      status: "error",
      stdout: "",
      stderr: "The Python runner could not be reached.",
    };
  }

  if (!response.ok) {
    return {
      passed: false,
      status: "error",
      stdout: "",
      stderr:
        response.status === 429
          ? "The Python runner is busy. Wait a moment and try again."
          : "The Python runner could not run this program.",
    };
  }

  let submission: Judge0Submission;
  try {
    submission = (await response.json()) as Judge0Submission;
  } catch {
    return {
      passed: false,
      status: "error",
      stdout: "",
      stderr: "The Python runner returned an unreadable result.",
    };
  }

  const stdout = clip(submission.stdout ?? "");
  const stderr = clip(
    [submission.stderr, submission.compile_output].filter(Boolean).join("\n"),
  );
  const statusId = submission.status?.id;

  if (statusId === 5) {
    return { passed: false, status: "timeout", stdout, stderr };
  }
  if (statusId !== 3) {
    return {
      passed: false,
      status: statusId === 6 ? "error" : "runtime_error",
      stdout,
      stderr: stderr || "The program stopped because of an error.",
    };
  }

  const passed = sameOutput(stdout, sample.expectedOutput);
  return {
    passed,
    status: passed ? "passed" : "wrong_answer",
    stdout,
    stderr,
  };
}
