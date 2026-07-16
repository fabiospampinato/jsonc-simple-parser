import { resolve } from "node:path";

export const test262Root = resolve("test/test262");

export const test262Patterns = [
  resolve(test262Root, "test/built-ins/JSON/*.js"),
  resolve(test262Root, "test/built-ins/JSON/**/*.js"),
];

// 164 source files × 2 scenarios (default + strict mode)
export const expectedTest262Executions = 328;
