import { twMerge } from "tailwind-merge";
import { cn } from "./index";

export function tc(
  ...inputs: Parameters<typeof cn>
): ReturnType<typeof twMerge> {
  return twMerge(cn(...inputs));
}
