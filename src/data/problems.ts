export type Difficulty = "Easy" | "Medium" | "Hard";

export type Problem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  acceptanceRate: number;
  summary: string;
};

/**
 * Sample problems used by the homepage and the problems page.
 * Later, this list can come from a database.
 */
export const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Map"],
    acceptanceRate: 54.2,
    summary: "Find two numbers in an array that add up to a target value.",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Strings", "Stack"],
    acceptanceRate: 42.8,
    summary: "Check whether every opening bracket has a matching closing bracket.",
  },
  {
    id: 3,
    title: "Reverse a Linked List",
    difficulty: "Easy",
    topics: ["Linked List"],
    acceptanceRate: 76.1,
    summary: "Reverse the order of nodes in a singly linked list.",
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    topics: ["Arrays", "Dynamic Programming"],
    acceptanceRate: 51.4,
    summary: "Find the contiguous subarray with the largest sum.",
  },
  {
    id: 5,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["Strings", "Sliding Window"],
    acceptanceRate: 36.7,
    summary: "Return the length of the longest substring that has no repeated characters.",
  },
  {
    id: 6,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: ["Tree", "Breadth-First Search"],
    acceptanceRate: 69.3,
    summary: "Visit every node in a binary tree, one level at a time.",
  },
  {
    id: 7,
    title: "Course Schedule",
    difficulty: "Medium",
    topics: ["Graph", "Topological Sort"],
    acceptanceRate: 48.9,
    summary: "Decide whether you can finish every course given prerequisite pairs.",
  },
  {
    id: 8,
    title: "Merge Intervals",
    difficulty: "Medium",
    topics: ["Arrays", "Sorting"],
    acceptanceRate: 49.6,
    summary: "Combine overlapping time ranges into the smallest set of intervals.",
  },
  {
    id: 9,
    title: "Word Search",
    difficulty: "Hard",
    topics: ["Strings", "Backtracking"],
    acceptanceRate: 43.1,
    summary: "Find whether a word can be traced through adjacent letters on a board.",
  },
  {
    id: 10,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Arrays", "Sorting"],
    acceptanceRate: 41.8,
    summary: "Find the median of two already sorted arrays in logarithmic time.",
  },
  {
    id: 11,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topics: ["Arrays", "Two Pointers"],
    acceptanceRate: 63.5,
    summary: "Calculate how much water a height map can hold after it rains.",
  },
  {
    id: 12,
    title: "Serialize and Deserialize a Binary Tree",
    difficulty: "Hard",
    topics: ["Tree", "Design"],
    acceptanceRate: 58.4,
    summary: "Turn a binary tree into a string and rebuild the same tree from that string.",
  },
  {
    id: 13,
    title: "Fizz Buzz",
    difficulty: "Easy",
    topics: ["Loops"],
    acceptanceRate: 72.6,
    summary: "Print numbers from 1 to n, replacing multiples of 3 and 5 with words.",
  },
  {
    id: 14,
    title: "Sum of Natural Numbers",
    difficulty: "Easy",
    topics: ["Loops"],
    acceptanceRate: 81.4,
    summary: "Add every whole number from 1 through n using a loop.",
  },
  {
    id: 15,
    title: "Bubble Sort",
    difficulty: "Easy",
    topics: ["Sorting", "Loops"],
    acceptanceRate: 64.9,
    summary: "Sort a list of numbers by repeatedly swapping neighbors that are out of order.",
  },
  {
    id: 16,
    title: "Reverse a String",
    difficulty: "Easy",
    topics: ["Strings", "Loops"],
    acceptanceRate: 78.2,
    summary: "Return a new string with the characters in reverse order.",
  },
];

export const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

export const topicFilters = ["Arrays", "Strings", "Loops", "Sorting"] as const;

export type TopicFilter = (typeof topicFilters)[number];

export function getProblemById(id: number) {
  return problems.find((problem) => problem.id === id);
}
