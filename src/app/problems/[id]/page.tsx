import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProblemWorkspace } from "@/components/problem-workspace";
import {
  languages,
  type Example,
  type Language,
  type ProblemDetail,
  getProblemDetail,
} from "@/data/problem-details";
import {
  difficulties,
  getProblemById,
  problems,
  type Difficulty,
  type Problem,
} from "@/data/problems";
import { createSupabaseClient } from "@/lib/supabase/client";

type ProblemPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return problems.map((problem) => ({ id: String(problem.id) }));
}

export async function generateMetadata({
  params,
}: ProblemPageProps): Promise<Metadata> {
  const { id } = await params;
  const problem = getProblemById(Number(id));

  if (problem) {
    return {
      title: `${problem.title} · CodePractice`,
      description: problem.summary,
    };
  }

  const remote = await getSupabaseProblem(Number(id));

  if (remote) {
    return {
      title: `${remote.problem.title} · CodePractice`,
      description: remote.problem.summary,
    };
  }

  return { title: "Problem not found · CodePractice" };
}

export default function ProblemPage({ params }: ProblemPageProps) {
  return (
    <Suspense fallback={<ProblemFallback />}>
      <ProblemDetails params={params} />
    </Suspense>
  );
}

function ProblemFallback() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <p className="text-sm text-stone-500">Loading problem...</p>
    </main>
  );
}

type NamedTopic = { name: string } | { name: string }[] | null;

type ProblemRecord = {
  id: number;
  title: string;
  difficulty: string;
  acceptance_rate: number | string;
  summary: string;
  description: string;
  input_explanation: string;
  output_explanation: string;
  problem_topics: { topics: NamedTopic }[] | null;
  problem_constraints: { position: number; body: string }[] | null;
  problem_examples: {
    position: number;
    input: string;
    output: string;
    explanation: string | null;
  }[] | null;
  starter_code: { code: string; languages: NamedTopic }[] | null;
};

function isDifficulty(value: string): value is Difficulty {
  return (difficulties as readonly string[]).includes(value);
}

function topicName(topics: NamedTopic) {
  if (!topics) return null;
  if (Array.isArray(topics)) return topics[0]?.name ?? null;
  return topics.name;
}

function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value);
}

function blankStarter(): Record<Language, string> {
  return {
    Python: "# Write your solution here\n",
    Java: "// Write your solution here\n",
    "C++": "// Write your solution here\n",
    JavaScript: "// Write your solution here\n",
  };
}

function toProblem(row: ProblemRecord): Problem | null {
  if (!isDifficulty(row.difficulty)) return null;

  const acceptanceRate = Number(row.acceptance_rate);
  if (!Number.isFinite(acceptanceRate)) return null;

  const topics = (row.problem_topics ?? [])
    .map((link) => topicName(link.topics))
    .filter((name): name is string => name !== null);

  return {
    id: row.id,
    title: row.title,
    difficulty: row.difficulty,
    topics,
    acceptanceRate,
    summary: row.summary,
  };
}

function toDetail(row: ProblemRecord): ProblemDetail {
  const constraints = [...(row.problem_constraints ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((constraint) => constraint.body);
  const examples: Example[] = [...(row.problem_examples ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((example) => ({
      input: example.input,
      output: example.output,
      explanation: example.explanation ?? undefined,
    }));
  const starterCode = blankStarter();

  for (const snippet of row.starter_code ?? []) {
    const name = topicName(snippet.languages);
    if (name && isLanguage(name)) {
      starterCode[name] = snippet.code;
    }
  }

  return {
    description: row.description,
    inputExplanation: row.input_explanation,
    outputExplanation: row.output_explanation,
    constraints,
    examples: examples.length > 0 ? examples : [{ input: "", output: "" }],
    starterCode,
  };
}

async function getSupabaseProblem(id: number) {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("problems")
      .select(
        "id, title, difficulty, acceptance_rate, summary, description, input_explanation, output_explanation, problem_topics(topics(name)), problem_constraints(position, body), problem_examples(position, input, output, explanation), starter_code(code, languages(name))",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as ProblemRecord;
    const problem = toProblem(row);
    if (!problem) return null;

    return { problem, detail: toDetail(row) };
  } catch {
    return null;
  }
}

async function ProblemDetails({ params }: ProblemPageProps) {
  const { id } = await params;
  const problemId = Number(id);
  const localProblem = getProblemById(problemId);
  const localDetail = getProblemDetail(problemId);

  if (localProblem && localDetail) {
    return (
      <ProblemWorkspace
        key={localProblem.id}
        problem={localProblem}
        detail={localDetail}
      />
    );
  }

  const remote = await getSupabaseProblem(problemId);

  if (!remote) {
    notFound();
  }

  return (
    <ProblemWorkspace
      key={remote.problem.id}
      problem={remote.problem}
      detail={remote.detail}
    />
  );
}
