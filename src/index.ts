type ClassValue = string | false | 0 | null | undefined;

export function cn(): string;
export function cn(a: ClassValue): string;
export function cn(a: ClassValue, b: ClassValue): string;
export function cn(a: ClassValue, b: ClassValue, c: ClassValue): string;
export function cn(
  a: ClassValue,
  b: ClassValue,
  c: ClassValue,
  d: ClassValue
): string;
export function cn(...args: ClassValue[]): string;
export function cn() {
  let s = "",
    a,
    l = arguments.length;
  for (let i = 0; i < l; i++) if ((a = arguments[i])) s = s ? s + " " + a : a;
  return s;
}

export { cn as default };
