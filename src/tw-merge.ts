import { twMerge } from "tailwind-merge";
import { cn as baseCn } from "./index";

export function cn(
  ...inputs: Parameters<typeof baseCn>
): ReturnType<typeof twMerge> {
  return twMerge(baseCn(...inputs));
}
