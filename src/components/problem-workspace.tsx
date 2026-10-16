"use client";

import { useState } from "react";
import Link from "next/link";
import type { Problem } from "@/data/problems";
import {
  executablePython,
  executableSample,
  languages,
  type Language,
  type ProblemDetail,
} from "@/data/problem-details";
import { difficultyStyles } from "@/components/difficulty-styles";

type CaseResult = {
  passed: boolean;
  status: "passed" | "wrong_answer" | "runtime_error" | "timeout" | "error";
  stdout: string;
  stderr: string;
};

type ExecutionResult = {
  title: string;
  body: string;
  cases?: CaseResult[];
};

const idleResult: ExecutionResult = {
  title: "Not run",
  body: "Run Code sends Python to a hosted sandbox and checks the public sample cases. Submit does not grade your solution.",
};

const submittedResult: ExecutionResult = {
  title: "Not submitted",
  body: "Submit did not send your code to a judge. Nothing was graded.",
};

const caseStatusLabel: Record<CaseResult["status"], string> = {
  passed: "Passed",
  wrong_answer: "Wrong answer",
  runtime_error: "Runtime error",
  timeout: "Timed out",
  error: "Could not run",
};

type ProblemWorkspaceProps = {
  problem: Problem;
  detail: ProblemDetail;
};

export function ProblemWorkspace({ problem, detail }: ProblemWorkspaceProps) {
  const [language, setLanguage] = useState<Language>("Python");
  const [codeByLanguage, setCodeByLanguage] = useState(detail.starterCode);
  const [result, setResult] = useState<ExecutionResult>(idleResult);
  const [running, setRunning] = useState(false);
  const [activeCase, setActiveCase] = useState(0);

  const styles = difficultyStyles[problem.difficulty];
  const sample = detail.examples[activeCase] ?? detail.examples[0];
  const sampleRun = executableSample(sample);

  function chooseLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setResult(idleResult);
  }

  async function runCode() {
    if (language !== "Python") {
      setResult({
        title: "Python only",
        body: "Run Code executes Python. Java and C++ stay in the editor and are not sent to the runner.",
      });
      return;
    }

    setRunning(true);
    setResult({
      title: "Running",
      body: "Your Python program is running in the hosted sandbox.",
    });

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python",
          code: executablePython(detail, codeByLanguage.Python),
          cases: detail.examples.map((example) => executableSample(example)),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        summary?: string;
        cases?: CaseResult[];
      };

      if (!response.ok || !payload.summary || !payload.cases) {
        setResult({
          title: "Could not run",
          body: payload.error || "The Python runner did not return a result.",
        });
        return;
      }

      setResult({
        title: payload.summary,
        body: "",
        cases: payload.cases,
      });
    } catch {
      setResult({
        title: "Could not run",
        body: "The app could not reach the Python runner.",
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/problems"
        className="text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
      >
        Back to problems
      </Link>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6">
          <p className="font-mono text-xs text-stone-400">#{problem.id}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              {problem.title}
            </h1>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
            >
              {problem.difficulty}
            </span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {problem.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
              >
                {topic}
              </li>
            ))}
          </ul>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Description
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-700 sm:text-base sm:leading-7">
            {detail.description}
          </p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Examples
          </h2>
          <div className="mt-3 space-y-3">
            {detail.examples.map((example, index) => (
              <article
                key={example.input}
                className="rounded-xl bg-stone-50 px-3 py-3"
              >
                <h3 className="text-sm font-semibold text-stone-900">
                  Example {index + 1}
                </h3>
                <p className="mt-2 text-xs font-medium text-stone-500">Input</p>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-stone-800">
                  {example.input}
                </pre>
                <p className="mt-3 text-xs font-medium text-stone-500">Output</p>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-stone-800">
                  {example.output}
                </pre>
                {example.explanation ? (
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {example.explanation}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Input
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            {detail.inputExplanation}
          </p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Output
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            {detail.outputExplanation}
          </p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Constraints
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-stone-700">
            {detail.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
            <div className="flex flex-col gap-3 border-b border-stone-800 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-stone-300">
                Language
                <select
                  value={language}
                  onChange={(event) =>
                    chooseLanguage(event.target.value as Language)
                  }
                  className="rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 text-sm text-stone-100"
                >
                  {languages.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void runCode()}
                  disabled={running}
                  className="rounded-lg border border-stone-600 px-3 py-2 text-sm font-semibold text-stone-100 hover:bg-stone-800 disabled:cursor-wait disabled:opacity-60"
                >
                  {running ? "Running..." : "Run Code"}
                </button>
                <button
                  type="button"
                  onClick={() => setResult(submittedResult)}
                  disabled={running}
                  className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Submit
                </button>
              </div>
            </div>
            <label htmlFor="code-editor" className="sr-only">
              Code editor for {problem.title} in {language}
            </label>
            <textarea
              id="code-editor"
              value={codeByLanguage[language]}
              onChange={(event) => {
                const nextCode = event.target.value;
                setCodeByLanguage((current) => ({
                  ...current,
                  [language]: nextCode,
                }));
                setResult(idleResult);
              }}
              spellCheck={false}
              className="min-h-72 w-full resize-y bg-stone-950 px-4 py-4 font-mono text-sm leading-6 text-stone-100 outline-none"
            />
            <p className="border-t border-stone-800 px-4 py-2 text-xs text-stone-400">
              Python runs in a hosted sandbox. Java and C++ are not executed.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-stone-900">
                Test cases
              </h2>
              <div className="flex flex-wrap gap-2">
                {detail.examples.map((example, index) => (
                  <button
                    key={example.input}
                    type="button"
                    onClick={() => setActiveCase(index)}
                    aria-pressed={activeCase === index}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      activeCase === index
                        ? "bg-teal-800 text-white"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    Case {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-stone-500">
                  Sample input
                </p>
                <pre className="mt-1 whitespace-pre-wrap rounded-xl bg-stone-50 px-3 py-3 font-mono text-sm text-stone-800">
                  {sampleRun.input}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-500">
                  Expected output
                </p>
                <pre className="mt-1 whitespace-pre-wrap rounded-xl bg-stone-50 px-3 py-3 font-mono text-sm text-stone-800">
                  {sample.output}
                </pre>
              </div>
            </div>

            <div
              className="mt-4 rounded-xl border border-dashed border-stone-300 px-3 py-3"
              aria-live="polite"
            >
              <p className="text-xs font-medium text-stone-500">
                Execution result
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {result.title}
              </p>
              {result.body ? (
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  {result.body}
                </p>
              ) : null}
              {result.cases?.map((caseResult, index) => (
                <div key={detail.examples[index]?.input ?? index} className="mt-3">
                  <p className="text-sm font-semibold text-stone-900">
                    Case {index + 1}: {caseStatusLabel[caseResult.status]}
                  </p>
                  <p className="mt-1 text-xs font-medium text-stone-500">
                    Your output
                  </p>
                  <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-stone-800">
                    {caseResult.stdout || "(no output)"}
                  </pre>
                  {caseResult.stderr ? (
                    <>
                      <p className="mt-2 text-xs font-medium text-stone-500">
                        Error
                      </p>
                      <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-stone-800">
                        {caseResult.stderr}
                      </pre>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
