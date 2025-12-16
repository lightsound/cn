import { describe, it, expect } from "bun:test";
import { tc } from "./tw-merge";

describe("tc", () => {
  describe("basic functionality", () => {
    it("should return empty string for no arguments", () => {
      expect(tc()).toBe("");
    });

    it("should return single string as-is", () => {
      expect(tc("foo")).toBe("foo");
    });

    it("should join multiple strings with space", () => {
      expect(tc("foo", "bar")).toBe("foo bar");
      expect(tc("foo", "bar", "baz")).toBe("foo bar baz");
    });
  });

  describe("falsy values handling", () => {
    it("should ignore false", () => {
      expect(tc("foo", false, "bar")).toBe("foo bar");
    });

    it("should ignore null", () => {
      expect(tc("foo", null, "bar")).toBe("foo bar");
    });

    it("should ignore undefined", () => {
      expect(tc("foo", undefined, "bar")).toBe("foo bar");
    });

    it("should ignore 0", () => {
      expect(tc("foo", 0, "bar")).toBe("foo bar");
    });
  });

  describe("tailwind-merge functionality", () => {
    it("should merge conflicting padding classes", () => {
      expect(tc("px-2 py-1", "p-3")).toBe("p-3");
    });

    it("should merge conflicting margin classes", () => {
      expect(tc("mx-2", "mx-4")).toBe("mx-4");
    });

    it("should merge conflicting text color classes", () => {
      expect(tc("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("should merge conflicting background color classes", () => {
      expect(tc("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("should keep non-conflicting classes", () => {
      expect(tc("flex", "items-center", "justify-between")).toBe(
        "flex items-center justify-between"
      );
    });

    it("should handle complex merge scenarios", () => {
      expect(tc("px-2 py-1 bg-red hover:bg-dark-red", "p-3 bg-[#B91C1C]")).toBe(
        "hover:bg-dark-red p-3 bg-[#B91C1C]"
      );
    });

    it("should handle arbitrary values", () => {
      expect(tc("p-[10px]", "p-[20px]")).toBe("p-[20px]");
    });
  });

  describe("conditional expressions with merge", () => {
    it("should work with && expressions and merge", () => {
      const isActive = true;
      expect(tc("text-gray-500", isActive && "text-blue-500")).toBe(
        "text-blue-500"
      );
    });

    it("should work with ternary expressions and merge", () => {
      const variant = "primary";
      expect(
        tc(
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
      const result = tc(baseClasses, variantClasses);
      expect(result).toBe("px-4 py-2 rounded bg-blue-500 text-white");
    });

    it("should handle responsive class overrides", () => {
      expect(tc("text-sm md:text-base", "text-lg")).toBe(
        "md:text-base text-lg"
      );
    });

    it("should handle hover state overrides", () => {
      expect(tc("hover:bg-blue-500", "hover:bg-red-500")).toBe(
        "hover:bg-red-500"
      );
    });
  });
});
