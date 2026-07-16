import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { buildTest262Prelude } from "../scripts/build-test262-prelude.mjs";
import { expectedTest262Executions, test262Patterns, test262Root } from "./test262-patterns.mjs";
import { runTest262 } from "./runners/test262-run.mjs";

const hasSuite = existsSync(resolve(test262Root, "package.json"));
const preludePath = resolve(test262Root, "prelude.js");

describe.skipIf(!hasSuite)("test262", () => {
  beforeAll(async () => {
    await buildTest262Prelude(preludePath);
  });

  it("passes all built-ins/JSON conformance tests", async () => {
    const result = await runTest262({
      preludePath,
      patterns: test262Patterns,
      threads: 8,
      reporter: "silent",
    });

    if (result.failures.length) {
      const summary = result.failures
        .slice(0, 5)
        .map((failure) => `${failure.file} (${failure.scenario}): ${failure.message}`)
        .join("\n");

      expect.fail(`${result.failed} test262 failures\n${summary}`);
    }

    expect(result.passed + result.failed).toBe(expectedTest262Executions);
    expect(result.failed).toBe(0);
  }, 120_000);
});
