import { describe, it, expect } from "bun:test";
import { cn } from "./tw-merge";

describe("cn (tw-merge)", () => {
  describe("basic functionality", () => {
    it("should return empty string for no arguments", () => {
      expect(cn()).toBe("");
    });

    it("should return single string as-is", () => {
      expect(cn("foo")).toBe("foo");
    });

    it("should join multiple strings with space", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
      expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
    });
  });

  describe("falsy values handling", () => {
    it("should ignore false", () => {
      expect(cn("foo", false, "bar")).toBe("foo bar");
    });

    it("should ignore null", () => {
      expect(cn("foo", null, "bar")).toBe("foo bar");
    });

    it("should ignore undefined", () => {
      expect(cn("foo", undefined, "bar")).toBe("foo bar");
    });

    it("should ignore 0", () => {
      expect(cn("foo", 0, "bar")).toBe("foo bar");
    });
  });

  describe("tailwind-merge functionality", () => {
    it("should merge conflicting padding classes", () => {
      expect(cn("px-2 py-1", "p-3")).toBe("p-3");
    });

    it("should merge conflicting margin classes", () => {
      expect(cn("mx-2", "mx-4")).toBe("mx-4");
    });

    it("should merge conflicting text color classes", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("should merge conflicting background color classes", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("should keep non-conflicting classes", () => {
      expect(cn("flex", "items-center", "justify-between")).toBe(
        "flex items-center justify-between"
      );
    });

    it("should handle complex merge scenarios", () => {
      expect(cn("px-2 py-1 bg-red hover:bg-dark-red", "p-3 bg-[#B91C1C]")).toBe(
        "hover:bg-dark-red p-3 bg-[#B91C1C]"
      );
    });

    it("should handle arbitrary values", () => {
      expect(cn("p-[10px]", "p-[20px]")).toBe("p-[20px]");
    });
  });

  describe("conditional expressions with merge", () => {
    it("should work with && expressions and merge", () => {
      const isActive = true;
      expect(cn("text-gray-500", isActive && "text-blue-500")).toBe(
        "text-blue-500"
      );
    });

    it("should work with ternary expressions and merge", () => {
      const variant = "primary";
      expect(
        cn(
          "bg-gray-500",
          variant === "primary" ? "bg-blue-500" : "bg-green-500"
        )
      ).toBe("bg-blue-500");
    });
  });

  describe("real-world patterns", () => {
    it("should handle component variant pattern with overrides", () => {
      const baseClasses = "px-4 py-2 rounded bg-gray-100 text-gray-900";
      const variantClasses = "bg-blue-500 text-white";
      const result = cn(baseClasses, variantClasses);
      expect(result).toBe("px-4 py-2 rounded bg-blue-500 text-white");
    });

    it("should handle responsive class overrides", () => {
      expect(cn("text-sm md:text-base", "text-lg")).toBe(
        "md:text-base text-lg"
      );
    });

    it("should handle hover state overrides", () => {
      expect(cn("hover:bg-blue-500", "hover:bg-red-500")).toBe(
        "hover:bg-red-500"
      );
    });
  });
});
