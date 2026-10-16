import type { Metadata } from "next";
import { ProblemBrowser } from "@/components/problem-browser";

export const metadata: Metadata = {
  title: "Problems · CodePractice",
  description:
    "Browse sample coding problems. Filter by difficulty and topic, or search by title.",
};

export default function ProblemsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <section className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-teal-800">
          Problems
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Coding problems
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600 sm:text-lg">
          Filter by Easy, Medium, or Hard, choose a topic, and search by
          title. Open a problem when you want to read it.
        </p>
      </section>
      <div className="mt-8">
        <ProblemBrowser />
      </div>
    </main>
  );
}
