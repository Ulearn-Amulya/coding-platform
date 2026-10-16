"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  difficulties,
  problems as sampleProblems,
  topicFilters,
  type Difficulty,
  type Problem,
  type TopicFilter,
} from "@/data/problems";
import { difficultyStyles } from "@/components/difficulty-styles";
import { createSupabaseClient } from "@/lib/supabase/client";

type TopicLink = {
  topics: { name: string } | { name: string }[] | null;
};

type ProblemRow = {
  id: number;
  title: string;
  difficulty: string;
  acceptance_rate: number | string;
  summary: string;
  problem_topics: TopicLink[] | null;
};

function isDifficulty(value: string): value is Difficulty {
  return (difficulties as readonly string[]).includes(value);
}

function topicName(topics: TopicLink["topics"]) {
  if (!topics) return null;
  if (Array.isArray(topics)) return topics[0]?.name ?? null;
  return topics.name;
}

function mergeProblems(sample: Problem[], remote: Problem[]) {
  const byId = new Map(sample.map((problem) => [problem.id, problem]));

  for (const problem of remote) {
    if (!byId.has(problem.id)) byId.set(problem.id, problem);
  }

  return [...byId.values()].sort((a, b) => a.id - b.id);
}

function toProblems(rows: ProblemRow[]): Problem[] {
  return rows.flatMap((row) => {
    if (!isDifficulty(row.difficulty)) return [];

    const acceptanceRate = Number(row.acceptance_rate);
    if (!Number.isFinite(acceptanceRate)) return [];

    const topics = (row.problem_topics ?? [])
      .map((link) => topicName(link.topics))
      .filter((name): name is string => name !== null);

    return [
      {
        id: row.id,
        title: row.title,
        difficulty: row.difficulty,
        topics,
        acceptanceRate,
        summary: row.summary,
      },
    ];
  });
}

export function ProblemBrowser() {
  const [catalog, setCatalog] = useState<Problem[]>(sampleProblems);
  const [query, setQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "All"
  >("All");
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter | "All">(
    "All",
  );

  useEffect(() => {
    let active = true;

    async function loadProblems() {
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from("problems")
          .select(
            "id, title, difficulty, acceptance_rate, summary, problem_topics(topics(name))",
          )
          .order("id", { ascending: true });

        if (!active || error || !data || data.length === 0) return;

        const nextProblems = toProblems(data as ProblemRow[]);
        if (nextProblems.length > 0) {
          setCatalog(mergeProblems(sampleProblems, nextProblems));
        }
      } catch {
        // Keep the sample problems when the public catalog cannot be read.
      }
    }

    void loadProblems();

    return () => {
      active = false;
    };
  }, []);

  const visibleProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return catalog.filter((problem) => {
      const matchesDifficulty =
        selectedDifficulty === "All" ||
        problem.difficulty === selectedDifficulty;
      const matchesTopic =
        selectedTopic === "All" || problem.topics.includes(selectedTopic);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        problem.title.toLowerCase().includes(normalizedQuery);

      return matchesDifficulty && matchesTopic && matchesQuery;
    });
  }, [catalog, query, selectedDifficulty, selectedTopic]);

  function chooseDifficulty(difficulty: Difficulty) {
    setSelectedDifficulty((current) =>
      current === difficulty ? "All" : difficulty,
    );
  }

  function chooseTopic(topic: TopicFilter) {
    setSelectedTopic((current) => (current === topic ? "All" : topic));
  }

  return (
    <div>
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label
          htmlFor="problem-title-search"
          className="text-sm font-medium text-stone-700"
        >
          Search problems by title
        </label>
        <input
          id="problem-title-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “Two Sum” or “Sort”"
          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 shadow-sm outline-none ring-teal-700 placeholder:text-stone-400 focus:border-teal-700 focus:ring-2"
        />
      </form>

      <div className="mt-6 flex flex-col gap-4">
        <fieldset>
          <legend className="text-sm font-medium text-stone-700">
            Difficulty
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {difficulties.map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty;
              const styles = difficultyStyles[difficulty];

              return (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => chooseDifficulty(difficulty)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${styles.card} ${
                    isSelected ? "ring-2 ring-stone-900" : ""
                  }`}
                >
                  {difficulty}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-stone-700">Topic</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {topicFilters.map((topic) => {
              const isSelected = selectedTopic === topic;

              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => chooseTopic(topic)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    isSelected
                      ? "border-teal-800 bg-teal-800 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold text-stone-900">All problems</h2>
        <p className="text-sm text-stone-500">{visibleProblems.length} shown</p>
      </div>

      {visibleProblems.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-8 text-center text-stone-600">
          No problems match those filters. Clear a filter or try another title.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {visibleProblems.map((problem) => {
            const styles = difficultyStyles[problem.difficulty];

            return (
              <li key={problem.id}>
                <article className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-stone-400">
                      #{problem.id}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-stone-900">
                      {problem.title}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {problem.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {problem.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
                        >
                          {topic}
                        </span>
                      ))}
                      <span className="text-xs font-medium text-stone-500">
                        {problem.acceptanceRate.toFixed(1)}% accepted
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                    >
                      {problem.difficulty}
                    </span>
                    <Link
                      href={`/problems/${problem.id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-teal-900"
                    >
                      Open
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
