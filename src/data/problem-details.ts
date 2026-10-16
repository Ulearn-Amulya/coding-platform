export const languages = ["Python", "Java", "C++", "JavaScript"] as const;

export type Language = (typeof languages)[number];

export type Example = {
  input: string;
  output: string;
  explanation?: string;
  /** Executable stdin. Omitted when the displayed input is already the program input. */
  stdin?: string;
};

export function executableSample(example: Example) {
  return {
    input: example.stdin ?? example.input,
    expectedOutput: example.output,
  };
}

export type ProblemDetail = {
  description: string;
  inputExplanation: string;
  outputExplanation: string;
  constraints: string[];
  examples: Example[];
  starterCode: Record<Language, string>;
  /** Definitions available to the submitted Python program, such as TreeNode. */
  pythonPrelude?: string;
  /** Calls the starter interface after the submitted Python program. */
  pythonDriver?: string;
};

export function executablePython(detail: ProblemDetail, source: string) {
  return `${detail.pythonPrelude ?? ""}${source}\n${detail.pythonDriver ?? ""}`;
}

function starter(
  python: string,
  java: string,
  cpp: string,
  javascript: string,
): Record<Language, string> {
  return {
    Python: python,
    Java: java,
    "C++": cpp,
    JavaScript: javascript,
  };
}

export const problemDetails: Record<number, ProblemDetail> = {
  1: {
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice.",
    inputExplanation:
      "The first line lists the integers in nums, separated by spaces. The second line is the integer target.",
    outputExplanation:
      "Print the two indices in increasing order, inside brackets and separated by a comma and space, such as [0, 1].",
    constraints: [
      "2 <= nums.length <= 10,000",
      "-1,000,000,000 <= nums[i] <= 1,000,000,000",
      "Exactly one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2, 7, 11, 15]\ntarget = 9",
        output: "[0, 1]",
        stdin: "2 7 11 15\n9\n",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9.",
      },
      {
        input: "nums = [3, 2, 4]\ntarget = 6",
        output: "[1, 2]",
        stdin: "3 2 4\n6\n",
      },
    ],
    starterCode: starter(
      "nums = list(map(int, input().split()))\ntarget = int(input())\npair = None\nfor i in range(len(nums)):\n    for j in range(i + 1, len(nums)):\n        # If these two values add up to target, save i and j.\n        pass\nprint(pair)\n",
      "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[] {};\n    }\n}\n",
      "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};\n",
      "function twoSum(nums, target) {\n  // Write your solution here\n  return [];\n}\n",
    ),
  },
  2: {
    description:
      "Given a string s containing only the characters '(', ')', '{', '}', '[' and ']', decide whether the string is valid. Every opening bracket must be closed by the same type of bracket, in the correct order.",
    inputExplanation:
      "The input is one line containing the bracket string s.",
    outputExplanation: "Return true when the brackets are valid, and false when they are not.",
    constraints: [
      "1 <= s.length <= 10,000",
      "s contains only bracket characters.",
    ],
    examples: [
      { input: 's = "()[]{}"', output: "true", stdin: "()[]{}\n" },
      { input: 's = "(]"', output: "false", stdin: "(]\n" },
    ],
    starterCode: starter(
      "s = input()\nstack = []\nvalid = None\nfor character in s:\n    # Match each closing bracket with the most recent opening bracket.\n    pass\nprint(valid)\n",
      "class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n        return false;\n    }\n};\n",
      "function isValid(s) {\n  // Write your solution here\n  return false;\n}\n",
    ),
  },
  3: {
    description:
      "Given the head of a singly linked list, reverse the list and return the new head.",
    inputExplanation:
      "The input is one line of node values from head to tail, separated by spaces. A blank line means the list is empty.",
    outputExplanation:
      "Print the reversed values inside brackets, separated by a comma and space, or [] when the list is empty.",
    constraints: [
      "The number of nodes is between 0 and 5,000.",
      "-5,000 <= Node.val <= 5,000",
    ],
    examples: [
      {
        input: "head = [1, 2, 3, 4, 5]",
        output: "[5, 4, 3, 2, 1]",
        stdin: "1 2 3 4 5\n",
      },
      { input: "head = []", output: "[]", stdin: "\n" },
    ],
    starterCode: starter(
      "values = input().split()\nreversed_values = []\nfor value in values:\n    # Place value at the front of reversed_values.\n    pass\nprint(\"[\" + \", \".join(reversed_values) + \"]\")\n",
      "class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution here\n        return head;\n    }\n}\n",
      "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your solution here\n        return head;\n    }\n};\n",
      "function reverseList(head) {\n  // Write your solution here\n  return head;\n}\n",
    ),
  },
  4: {
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum and return that sum.",
    inputExplanation:
      "The input is one line of integers from nums, separated by spaces.",
    outputExplanation: "Print one integer: the largest sum of any contiguous subarray.",
    constraints: [
      "1 <= nums.length <= 100,000",
      "-10,000 <= nums[i] <= 10,000",
    ],
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        stdin: "-2 1 -3 4 -1 2 1 -5 4\n",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum.",
      },
      { input: "nums = [1]", output: "1", stdin: "1\n" },
    ],
    starterCode: starter(
      "nums = list(map(int, input().split()))\nbest = None\n# Keep the largest sum of any contiguous slice of nums.\nprint(best)\n",
      "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};\n",
      "function maxSubArray(nums) {\n  // Write your solution here\n  return 0;\n}\n",
    ),
  },
  5: {
    description:
      "Given a string s, find the length of the longest substring that does not contain repeating characters.",
    inputExplanation: "The input is one line containing the string s.",
    outputExplanation:
      "Print the length of the longest stretch of characters with no repeats.",
    constraints: [
      "0 <= s.length <= 50,000",
      "s consists of English letters, digits, symbols, and spaces.",
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        stdin: "abcabcbb\n",
        explanation: '"abc" has length 3.',
      },
      { input: 's = "bbbbb"', output: "1", stdin: "bbbbb\n" },
    ],
    starterCode: starter(
      "s = input()\nbest = 0\n# Find the longest stretch of s with no repeated characters.\nprint(best)\n",
      "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        return 0;\n    }\n};\n",
      "function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  return 0;\n}\n",
    ),
  },
  6: {
    description:
      "Given the root of a binary tree, return the values of its nodes grouped by level, from left to right.",
    inputExplanation:
      "The input is one line of level-order node values separated by spaces. Use null for a missing child. A blank line means the tree is empty.",
    outputExplanation:
      "Print the levels as a list of lists, such as [[3], [9, 20], [15, 7]], or [] for an empty tree.",
    constraints: [
      "The number of nodes is between 0 and 2,000.",
      "-1,000 <= Node.val <= 1,000",
    ],
    examples: [
      {
        input: "root = [3, 9, 20, null, null, 15, 7]",
        output: "[[3], [9, 20], [15, 7]]",
        stdin: "3 9 20 null null 15 7\n",
      },
      { input: "root = []", output: "[]", stdin: "\n" },
    ],
    starterCode: starter(
      "values = input().split()\nlevels = []\n# Group values by level from left to right. Skip null.\nprint(\"[\" + \", \".join(\"[\" + \", \".join(level) + \"]\" for level in levels) + \"]\")\n",
      "class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n        return {};\n    }\n};\n",
      "function levelOrder(root) {\n  // Write your solution here\n  return [];\n}\n",
    ),
  },
  7: {
    description:
      "There are numCourses courses labeled from 0 to numCourses - 1. prerequisites[i] = [a, b] means you must take course b before course a. Return true if you can finish all courses.",
    inputExplanation:
      "The first line is numCourses. The second line is how many prerequisite pairs there are. Each following line is one pair a b, meaning course b comes before course a.",
    outputExplanation:
      "Return true when a valid order exists, and false when the requirements form a cycle.",
    constraints: [
      "1 <= numCourses <= 2,000",
      "0 <= prerequisites.length <= 5,000",
    ],
    examples: [
      {
        input: "numCourses = 2\nprerequisites = [[1, 0]]",
        output: "true",
        stdin: "2\n1\n1 0\n",
      },
      {
        input: "numCourses = 2\nprerequisites = [[1, 0], [0, 1]]",
        output: "false",
        stdin: "2\n2\n1 0\n0 1\n",
      },
    ],
    starterCode: starter(
      "num_courses = int(input())\npair_count = int(input())\nprerequisites = [tuple(map(int, input().split())) for _ in range(pair_count)]\ncan_finish = None\n# Each pair is (a, b): course b comes before course a.\nprint(can_finish)\n",
      "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your solution here\n        return false;\n    }\n};\n",
      "function canFinish(numCourses, prerequisites) {\n  // Write your solution here\n  return false;\n}\n",
    ),
  },
  8: {
    description:
      "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return the result.",
    inputExplanation:
      "The first line is how many intervals there are. Each following line is one interval, with start and end separated by a space.",
    outputExplanation:
      "Print the merged intervals as a list of pairs, such as [[1, 6], [8, 10], [15, 18]].",
    constraints: [
      "1 <= intervals.length <= 10,000",
      "intervals[i].length == 2",
    ],
    examples: [
      {
        input: "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]",
        output: "[[1, 6], [8, 10], [15, 18]]",
        stdin: "4\n1 3\n2 6\n8 10\n15 18\n",
      },
      {
        input: "intervals = [[1, 4], [4, 5]]",
        output: "[[1, 5]]",
        stdin: "2\n1 4\n4 5\n",
      },
    ],
    starterCode: starter(
      "count = int(input())\nintervals = [list(map(int, input().split())) for _ in range(count)]\nmerged = []\n# Combine overlapping intervals into merged.\nprint(\"[\" + \", \".join(f\"[{start}, {end}]\" for start, end in merged) + \"]\")\n",
      "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n        return new int[][] {};\n    }\n}\n",
      "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n        return {};\n    }\n};\n",
      "function merge(intervals) {\n  // Write your solution here\n  return [];\n}\n",
    ),
  },
  9: {
    description:
      "Given an m x n grid of letters and a word, return true if the word can be formed from letters that touch horizontally or vertically. The same cell cannot be used twice in one word.",
    inputExplanation:
      "The first line is the number of rows and the number of columns. Each following line is one row of the board, with letters separated by spaces. The last line is the word.",
    outputExplanation: "Return true if the word exists on the board, otherwise false.",
    constraints: [
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word contain only English letters.",
    ],
    examples: [
      {
        input:
          'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nword = "ABCCED"',
        output: "true",
        stdin: "3 4\nA B C E\nS F C S\nA D E E\nABCCED\n",
      },
      {
        input:
          'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nword = "ABCB"',
        output: "false",
        stdin: "3 4\nA B C E\nS F C S\nA D E E\nABCB\n",
      },
    ],
    starterCode: starter(
      "rows, cols = map(int, input().split())\nboard = [input().split() for _ in range(rows)]\nword = input().strip()\nfound = None\n# Search letters that touch horizontally or vertically. Do not reuse a cell.\nprint(found)\n",
      "class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Write your solution here\n        return false;\n    }\n};\n",
      "function exist(board, word) {\n  // Write your solution here\n  return false;\n}\n",
    ),
  },
  10: {
    description:
      "Given two sorted arrays nums1 and nums2, return the median of the combined sorted values.",
    inputExplanation:
      "The first line lists the integers in nums1, separated by spaces. The second line lists the integers in nums2. A blank line means that array is empty.",
    outputExplanation: "Print the median as a decimal number.",
    constraints: [
      "0 <= nums1.length, nums2.length <= 1,000",
      "1 <= nums1.length + nums2.length <= 2,000",
    ],
    examples: [
      {
        input: "nums1 = [1, 3]\nnums2 = [2]",
        output: "2.00000",
        stdin: "1 3\n2\n",
      },
      {
        input: "nums1 = [1, 2]\nnums2 = [3, 4]",
        output: "2.50000",
        stdin: "1 2\n3 4\n",
      },
    ],
    starterCode: starter(
      "nums1 = list(map(int, input().split()))\nnums2 = list(map(int, input().split()))\nmedian = None\n# Find the median of the combined sorted values.\nprint(median)\n",
      "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}\n",
      "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n};\n",
      "function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n  return 0;\n}\n",
    ),
  },
  11: {
    description:
      "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    inputExplanation:
      "The input is one line of bar heights, separated by spaces.",
    outputExplanation: "Print one integer, the total units of water that can be trapped.",
    constraints: [
      "1 <= height.length <= 20,000",
      "0 <= height[i] <= 100,000",
    ],
    examples: [
      {
        input: "height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        output: "6",
        stdin: "0 1 0 2 1 0 1 3 2 1 2 1\n",
      },
      {
        input: "height = [4, 2, 0, 3, 2, 5]",
        output: "9",
        stdin: "4 2 0 3 2 5\n",
      },
    ],
    starterCode: starter(
      "height = list(map(int, input().split()))\nwater = 0\n# Add the water trapped above each bar.\nprint(water)\n",
      "class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your solution here\n        return 0;\n    }\n};\n",
      "function trap(height) {\n  // Write your solution here\n  return 0;\n}\n",
    ),
  },
  12: {
    description:
      "Design a way to turn a binary tree into a string, and a way to rebuild the same tree from that string.",
    inputExplanation:
      "Each public sample gives one line of level-order node values separated by spaces. null means a missing child, and a blank line means an empty tree. Run Code builds that tree and passes it to Codec.serialize.",
    outputExplanation:
      "Codec.deserialize must rebuild the same tree from the string returned by Codec.serialize. The rebuilt tree is printed as a level-order list.",
    constraints: [
      "The number of nodes is between 0 and 10,000.",
      "-1,000 <= Node.val <= 1,000",
    ],
    examples: [
      {
        input: "root = [1, 2, 3, null, null, 4, 5]",
        output: "[1, 2, 3, null, null, 4, 5]",
        stdin: "1 2 3 null null 4 5\n",
        explanation: "Serializing this tree and deserializing the result rebuilds the same nodes.",
      },
      {
        input: "root = []",
        output: "[]",
        stdin: "\n",
        explanation: "An empty tree round-trips to an empty tree.",
      },
    ],
    pythonPrelude:
      "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n",
    pythonDriver: `def __cp_build(tokens):
    if not tokens:
        return None
    root = TreeNode(int(tokens[0]))
    queue = [root]
    index = 1
    while queue and index < len(tokens):
        node = queue.pop(0)
        left = tokens[index]
        index += 1
        if left != "null":
            node.left = TreeNode(int(left))
            queue.append(node.left)
        if index >= len(tokens):
            break
        right = tokens[index]
        index += 1
        if right != "null":
            node.right = TreeNode(int(right))
            queue.append(node.right)
    return root

def __cp_dump(root):
    if root is None:
        return "[]"
    queue = [root]
    values = []
    while queue:
        node = queue.pop(0)
        if node is None:
            values.append("null")
            continue
        values.append(str(node.val))
        queue.append(node.left)
        queue.append(node.right)
    while values and values[-1] == "null":
        values.pop()
    return "[" + ", ".join(values) + "]"

__cp_line = input()
__cp_tokens = __cp_line.split() if __cp_line.strip() else []
__cp_codec = Codec()
__cp_restored = __cp_codec.deserialize(__cp_codec.serialize(__cp_build(__cp_tokens)))
print(__cp_dump(__cp_restored))
`,
    starterCode: starter(
      "class Codec:\n    def serialize(self, root):\n        # root is a TreeNode or None. Return a string.\n        return \"\"\n\n    def deserialize(self, data):\n        # data is the string from serialize. Return the rebuilt TreeNode.\n        return None\n",
      "public class Codec {\n    public String serialize(TreeNode root) {\n        // Write your solution here\n        return \"\";\n    }\n\n    public TreeNode deserialize(String data) {\n        // Write your solution here\n        return null;\n    }\n}\n",
      "class Codec {\npublic:\n    string serialize(TreeNode* root) {\n        // Write your solution here\n        return \"\";\n    }\n\n    TreeNode* deserialize(string data) {\n        // Write your solution here\n        return nullptr;\n    }\n};\n",
      "const codec = {\n  serialize(root) {\n    // Write your solution here\n    return \"\";\n  },\n  deserialize(data) {\n    // Write your solution here\n    return null;\n  },\n};\n",
    ),
  },
  13: {
    description:
      "Given an integer n, return a list of strings for the numbers from 1 to n. For multiples of 3 use \"Fizz\", for multiples of 5 use \"Buzz\", and for multiples of both use \"FizzBuzz\".",
    inputExplanation: "The input is one line containing the integer n.",
    outputExplanation:
      'Print n quoted strings inside brackets, one for each number from 1 through n, such as ["1", "2", "Fizz"].',
    constraints: ["1 <= n <= 10,000"],
    examples: [
      {
        input: "n = 5",
        output: '["1", "2", "Fizz", "4", "Buzz"]',
        stdin: "5\n",
      },
      { input: "n = 3", output: '["1", "2", "Fizz"]', stdin: "3\n" },
    ],
    starterCode: starter(
      "n = int(input())\nwords = []\nfor number in range(1, n + 1):\n    # Append FizzBuzz, Fizz, Buzz, or the number as text.\n    pass\nprint(\"[\" + \", \".join('\"' + word + '\"' for word in words) + \"]\")\n",
      "class Solution {\n    public List<String> fizzBuzz(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        // Write your solution here\n        return {};\n    }\n};\n",
      "function fizzBuzz(n) {\n  // Write your solution here\n  return [];\n}\n",
    ),
  },
  14: {
    description:
      "Given a positive integer n, return the sum of every whole number from 1 through n.",
    inputExplanation: "The input is one line containing the integer n.",
    outputExplanation: "Print one integer, the total of 1 + 2 + ... + n.",
    constraints: ["1 <= n <= 10,000"],
    examples: [
      { input: "n = 5", output: "15", stdin: "5\n", explanation: "1 + 2 + 3 + 4 + 5 = 15." },
      { input: "n = 1", output: "1", stdin: "1\n" },
    ],
    starterCode: starter(
      "n = int(input())\ntotal = 0\nfor number in range(1, n + 1):\n    # Add number to total.\n    pass\nprint(total)\n",
      "class Solution {\n    public int sumNatural(int n) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "class Solution {\npublic:\n    int sumNatural(int n) {\n        // Write your solution here\n        return 0;\n    }\n};\n",
      "function sumNatural(n) {\n  // Write your solution here\n  return 0;\n}\n",
    ),
  },
  15: {
    description:
      "Sort an array of integers into increasing order by repeatedly comparing neighbors and swapping them when they are out of order.",
    inputExplanation:
      "The input is one line of integers from nums, separated by spaces.",
    outputExplanation:
      "Print the same numbers from smallest to largest, inside brackets and separated by a comma and space.",
    constraints: [
      "1 <= nums.length <= 1,000",
      "-10,000 <= nums[i] <= 10,000",
    ],
    examples: [
      { input: "nums = [5, 1, 4, 2, 8]", output: "[1, 2, 4, 5, 8]", stdin: "5 1 4 2 8\n" },
      { input: "nums = [3]", output: "[3]", stdin: "3\n" },
    ],
    starterCode: starter(
      "nums = list(map(int, input().split()))\nfor i in range(len(nums)):\n    for j in range(len(nums) - 1):\n        # If nums[j] is greater than the next value, swap them.\n        pass\nprint(\"[\" + \", \".join(map(str, nums)) + \"]\")\n",
      "class Solution {\n    public int[] bubbleSort(int[] nums) {\n        // Write your solution here\n        return nums;\n    }\n}\n",
      "class Solution {\npublic:\n    vector<int> bubbleSort(vector<int>& nums) {\n        // Write your solution here\n        return nums;\n    }\n};\n",
      "function bubbleSort(nums) {\n  // Write your solution here\n  return nums;\n}\n",
    ),
  },
  16: {
    description: "Given a string s, return a new string with the characters in reverse order.",
    inputExplanation: "s is the string to reverse.",
    outputExplanation: "Return the characters of s from last to first.",
    constraints: [
      "0 <= s.length <= 10,000",
      "s consists of printable characters.",
    ],
    examples: [
      { input: "hello", output: "olleh" },
      { input: "a", output: "a" },
    ],
    pythonDriver: "print(reverse_string(input()))\n",
    starterCode: starter(
      "def reverse_string(s):\n    # Write your solution here\n    return \"\"\n",
      "class Solution {\n    public String reverseString(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}\n",
      "class Solution {\npublic:\n    string reverseString(string s) {\n        // Write your solution here\n        return \"\";\n    }\n};\n",
      "function reverseString(s) {\n  // Write your solution here\n  return \"\";\n}\n",
    ),
  },
};

export function getProblemDetail(id: number) {
  return problemDetails[id];
}
