import { readFileSync, writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "rolldown";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = mkdtempSync(join(tmpdir(), "jsonc-perf-"));
const outfile = join(tmp, "bundle.mjs");

await build({
  input: resolve(root, "src/index.ts"),
  output: {
    file: outfile,
    format: "esm",
  },
  external: [],
  platform: "neutral",
});

const JSONC = (await import(pathToFileURL(outfile).href)).default;

const sampleInvalid = readFileSync(resolve(root, "tasks/sample_invalid.json"), "utf8");
const sampleWithComments = readFileSync(resolve(root, "tasks/sample_with_comments.json"), "utf8");
const sampleWithoutComments = readFileSync(
  resolve(root, "tasks/sample_without_comments.json"),
  "utf8",
);
const sampleWithErrors = readFileSync(resolve(root, "tasks/sample_with_errors.json"), "utf8");

function measure(name, fn, { warmup = 20, samples = 80 } = {}) {
  for (let i = 0; i < warmup; i++) fn();

  const times = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }

  times.sort((a, b) => a - b);
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const p50 = times[Math.floor(times.length * 0.5)];
  const p95 = times[Math.floor(times.length * 0.95)];

  return {
    name,
    meanMs: Number(mean.toFixed(4)),
    p50Ms: Number(p50.toFixed(4)),
    p95Ms: Number(p95.toFixed(4)),
    hz: Number((1000 / mean).toFixed(2)),
    samples: times.length,
  };
}

const suites = [
  measure(
    "parse.invalid",
    () => {
      try {
        JSONC.parse(sampleInvalid);
      } catch {}
    },
    { warmup: 50, samples: 200 },
  ),
  measure(
    "parse.withComments",
    () => {
      JSONC.parse(sampleWithComments);
    },
    { warmup: 10, samples: 40 },
  ),
  measure(
    "parse.withoutComments",
    () => {
      JSONC.parse(sampleWithoutComments);
    },
    { warmup: 20, samples: 80 },
  ),
  measure(
    "parse.nativeBaseline",
    () => {
      JSON.parse(sampleWithoutComments);
    },
    { warmup: 20, samples: 80 },
  ),
  measure(
    "lookup.start",
    () => {
      JSONC.lookup(sampleWithoutComments, 150);
    },
    { warmup: 30, samples: 100 },
  ),
  measure(
    "lookup.middle",
    () => {
      JSONC.lookup(sampleWithoutComments, 41111);
    },
    { warmup: 10, samples: 40 },
  ),
  measure(
    "lookup.end",
    () => {
      JSONC.lookup(sampleWithoutComments, 92900);
    },
    { warmup: 10, samples: 40 },
  ),
  measure(
    "lookup.fullScanMiddle",
    () => {
      JSONC.lookup(sampleWithoutComments, 41111, false);
    },
    { warmup: 5, samples: 25 },
  ),
  measure(
    "validate.withComments",
    () => {
      JSONC.validate(sampleWithComments);
    },
    { warmup: 10, samples: 40 },
  ),
  measure(
    "validate.withErrors",
    () => {
      JSONC.validate(sampleWithErrors);
    },
    { warmup: 15, samples: 60 },
  ),
];

rmSync(tmp, { recursive: true, force: true });

const label = process.argv[2] || "run";
const payload = {
  label,
  node: process.version,
  platform: `${process.platform} ${process.arch}`,
  date: new Date().toISOString(),
  samples: {
    invalidBytes: sampleInvalid.length,
    withCommentsBytes: sampleWithComments.length,
    withoutCommentsBytes: sampleWithoutComments.length,
    withErrorsBytes: sampleWithErrors.length,
  },
  results: suites,
};

writeFileSync(resolve(root, `tasks/perf-${label}.json`), JSON.stringify(payload, null, 2));
console.log(JSON.stringify(payload, null, 2));
