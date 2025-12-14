export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // This repo intentionally does not use scopes (e.g. feat(core): ...)
    "scope-empty": [2, "always"],
  },
};
