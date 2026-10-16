"use client";

import { useMemo, useState } from "react";
import {
  difficulties,
  problems,
  type Difficulty,
} from "@/data/problems";
import { difficultyStyles } from "@/components/difficulty-styles";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "All"
  >("All");

  const counts = useMemo(() => {
    return {
      Easy: problems.filter((problem) => problem.difficulty === "Easy").length,
      Medium: problems.filter((problem) => problem.difficulty === "Medium")
        .length,
      Hard: problems.filter((problem) => problem.difficulty === "Hard").length,
    };
  }, []);

  const visibleProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesDifficulty =
        selectedDifficulty === "All" ||
        problem.difficulty === selectedDifficulty;

      const searchableText = [
        problem.title,
        problem.summary,
        ...problem.topics,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesDifficulty && matchesQuery;
    });
  }, [query, selectedDifficulty]);

  function chooseDifficulty(difficulty: Difficulty) {
    setSelectedDifficulty((current) =>
      current === difficulty ? "All" : difficulty,
    );
  }

  return (
    <main
      id="practice"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12"
    >
        <section className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-800">
            Practice
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Solve coding problems at your own pace
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600 sm:text-lg">
            Search by title or topic, then pick Easy, Medium, or Hard. These
            problems are sample data so you can explore the homepage before
            any database is connected.
          </p>
        </section>

        <form
          className="mt-8"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label
            htmlFor="problem-search"
            className="text-sm font-medium text-stone-700"
          >
            Search coding questions
          </label>
          <input
            id="problem-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “array”, “tree”, or “Two Sum”"
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 shadow-sm outline-none ring-teal-700 placeholder:text-stone-400 focus:border-teal-700 focus:ring-2"
          />
        </form>

        <section className="mt-8" aria-labelledby="difficulty-heading">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="difficulty-heading"
              className="text-lg font-semibold text-stone-900"
            >
              Categories
            </h2>
            {selectedDifficulty !== "All" ? (
              <button
                type="button"
                onClick={() => setSelectedDifficulty("All")}
                className="text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
              >
                Show all difficulties
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {difficulties.map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty;
              const styles = difficultyStyles[difficulty];

              return (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => chooseDifficulty(difficulty)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${styles.card} ${
                    isSelected ? "ring-2 ring-stone-900" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-stone-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
                    {difficulty}
                  </span>
                  <span className="mt-2 block text-2xl font-semibold text-stone-900">
                    {counts[difficulty]}
                  </span>
                  <span className="mt-1 block text-sm text-stone-600">
                    {counts[difficulty] === 1 ? "problem" : "problems"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="problems-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="problems-heading"
              className="text-lg font-semibold text-stone-900"
            >
              Problems
            </h2>
            <p className="text-sm text-stone-500">
              {visibleProblems.length} shown
            </p>
          </div>

          {visibleProblems.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-8 text-center text-stone-600">
              No problems match that search. Try a different title or topic.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {visibleProblems.map((problem) => {
                const styles = difficultyStyles[problem.difficulty];

                return (
                  <li key={problem.id}>
                    <article className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                      <div>
                        <p className="font-mono text-xs text-stone-400">
                          #{problem.id}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-stone-900">
                          {problem.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-stone-600">
                          {problem.summary}
                        </p>
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
                      </div>
                      <span
                        className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                      >
                        {problem.difficulty}
                      </span>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
    </main>
  );
}
