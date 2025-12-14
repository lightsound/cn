import { describe, it, expect } from "bun:test";
import { cn } from "./index";
import cnDefault from "./index";

describe("cn", () => {
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
      expect(cn(false, "foo")).toBe("foo");
      expect(cn("foo", false)).toBe("foo");
    });

    it("should ignore null", () => {
      expect(cn("foo", null, "bar")).toBe("foo bar");
      expect(cn(null, "foo")).toBe("foo");
    });

    it("should ignore undefined", () => {
      expect(cn("foo", undefined, "bar")).toBe("foo bar");
      expect(cn(undefined, "foo")).toBe("foo");
    });

    it("should ignore empty string", () => {
      expect(cn("foo", "", "bar")).toBe("foo bar");
      expect(cn("", "foo")).toBe("foo");
    });

    it("should ignore 0", () => {
      expect(cn("foo", 0, "bar")).toBe("foo bar");
      expect(cn(0, "foo")).toBe("foo");
    });

    it("should handle all falsy values together", () => {
      expect(cn(false, null, undefined, "", 0, "foo")).toBe("foo");
      expect(cn("foo", false, null, undefined, "", 0)).toBe("foo");
      expect(cn(false, "foo", null, "bar", undefined)).toBe("foo bar");
    });

    it("should return empty string for all falsy values", () => {
      expect(cn(false, null, undefined, "", 0)).toBe("");
    });
  });

  describe("conditional expressions", () => {
    it("should work with && expressions", () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn("btn", isActive && "active", isDisabled && "disabled")).toBe(
        "btn active"
      );
    });

    it("should work with ternary expressions", () => {
      const variant = "primary";
      expect(
        cn("btn", variant === "primary" ? "btn-primary" : "btn-secondary")
      ).toBe("btn btn-primary");
    });
  });

  describe("real-world patterns", () => {
    it("should work with Tailwind-like classes", () => {
      const result = cn(
        "flex",
        "items-center",
        "justify-between",
        "p-4",
        "bg-white"
      );
      expect(result).toBe("flex items-center justify-between p-4 bg-white");
    });

    it("should work with dynamic Tailwind classes", () => {
      const isOpen = true;
      const size = "large" as string;
      const result = cn(
        "dropdown",
        isOpen && "dropdown-open",
        size === "large" && "dropdown-lg",
        size === "small" && "dropdown-sm"
      );
      expect(result).toBe("dropdown dropdown-open dropdown-lg");
    });

    it("should handle component variant pattern", () => {
      const props: {
        variant: "primary" | "secondary";
        size: "sm" | "md" | "lg";
        disabled: boolean;
        className: string;
      } = {
        variant: "primary",
        size: "md",
        disabled: false,
        className: "custom-class",
      };

      const result = cn(
        "btn",
        props.variant === "primary" && "btn-primary",
        props.variant === "secondary" && "btn-secondary",
        props.size === "sm" && "btn-sm",
        props.size === "md" && "btn-md",
        props.size === "lg" && "btn-lg",
        props.disabled && "btn-disabled",
        props.className
      );

      expect(result).toBe("btn btn-primary btn-md custom-class");
    });
  });

  describe("edge cases", () => {
    it("should handle strings with spaces", () => {
      expect(cn("class with spaces", "another one")).toBe(
        "class with spaces another one"
      );
    });

    it("should handle strings with special characters", () => {
      expect(cn("hover:bg-blue-500", "focus:ring-2")).toBe(
        "hover:bg-blue-500 focus:ring-2"
      );
      expect(cn("[&>*]:p-2", "data-[state=open]:bg-white")).toBe(
        "[&>*]:p-2 data-[state=open]:bg-white"
      );
    });

    it("should handle many arguments", () => {
      const classes = Array(100).fill("class");
      const result = cn(...classes);
      expect(result.split(" ").length).toBe(100);
    });
  });

  describe("exports", () => {
    it("should export cn as named export", () => {
      expect(typeof cn).toBe("function");
    });

    it("should export cn as default export", () => {
      expect(typeof cnDefault).toBe("function");
      expect(cnDefault).toBe(cn);
    });
  });
});
