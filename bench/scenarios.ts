/**
 * Common benchmark scenarios used by both CI and README updates.
 * This ensures consistency between CI validation and README display.
 */

export type Scenario = {
  name: string;
  args: readonly (string | false | null | undefined | 0)[];
};

export const scenarios: readonly Scenario[] = [
  {
    name: "2 strings",
    args: ["foo", "bar"],
  },
  {
    name: "3 strings",
    args: ["foo", "bar", "baz"],
  },
  {
    name: "5 strings",
    args: [
      "text-base",
      "font-medium",
      "text-gray-900",
      "hover:text-blue-500",
      "transition-colors",
    ],
  },
  {
    name: "10 strings",
    args: [
      "flex",
      "items-center",
      "justify-between",
      "p-4",
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "hover:shadow-lg",
      "transition-all",
      "duration-200",
    ],
  },
] as const;
