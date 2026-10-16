import type { Difficulty } from "@/data/problems";

export const difficultyStyles: Record<
  Difficulty,
  { card: string; badge: string; dot: string }
> = {
  Easy: {
    card: "border-emerald-200 bg-emerald-50 hover:border-emerald-400",
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  },
  Medium: {
    card: "border-amber-200 bg-amber-50 hover:border-amber-400",
    badge: "bg-amber-100 text-amber-900",
    dot: "bg-amber-500",
  },
  Hard: {
    card: "border-rose-200 bg-rose-50 hover:border-rose-400",
    badge: "bg-rose-100 text-rose-800",
    dot: "bg-rose-500",
  },
};
