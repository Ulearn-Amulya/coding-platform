import { runPythonSample, validatePythonRun } from "@/lib/python-runner";

const WINDOW_MS = 60_000;
const MAX_RUNS_PER_WINDOW = 6;
const recentRuns = new Map<string, number[]>();

function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

function withinRateLimit(address: string) {
  const now = Date.now();
  const recent = (recentRuns.get(address) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );
  if (recent.length >= MAX_RUNS_PER_WINDOW) {
    recentRuns.set(address, recent);
    return false;
  }
  recent.push(now);
  recentRuns.set(address, recent);
  return true;
}

export async function POST(request: Request) {
  if (!withinRateLimit(clientAddress(request))) {
    return Response.json(
      { error: "Too many runs. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "The run request was not valid JSON." },
      { status: 400 },
    );
  }

  let code: string;
  let cases: { input: string; expectedOutput: string }[];
  try {
    ({ code, cases } = validatePythonRun(body));
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The run request could not be checked.",
      },
      { status: 400 },
    );
  }

  const results = [];
  for (const sample of cases) {
    results.push(await runPythonSample(code, sample));
  }

  const passed = results.filter((result) => result.passed).length;
  return Response.json({
    summary: `${passed} of ${results.length} public sample cases passed`,
    cases: results,
  });
}
