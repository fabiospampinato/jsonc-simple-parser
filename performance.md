# Performance report (v3.0.1)

Measured before/after the performance work on this branch. Numbers are wall-clock means from a controlled microbenchmark (`tasks/measure-perf.mjs`), not Vitest’s experimental bench runner.

## Environment

|          |                                                                 |
| -------- | --------------------------------------------------------------- |
| Node     | v24.16.0                                                        |
| Platform | win32 x64                                                       |
| Date     | 2026-07-16                                                      |
| Method   | Rolldown-bundled `src/index.ts`, timed with `performance.now()` |

### Fixtures

| Fixture                              | Size          |
| ------------------------------------ | ------------- |
| `tasks/sample_invalid.json`          | 64 bytes      |
| `tasks/sample_with_comments.json`    | 100,017 bytes |
| `tasks/sample_without_comments.json` | 99,974 bytes  |
| `tasks/sample_with_errors.json`      | 96,702 bytes  |

### Reproduce

```sh
# After changes
node tasks/measure-perf.mjs after

# Baseline (stash perf commits / restore pre-change sources), then:
node tasks/measure-perf.mjs before
```

Raw JSON: [`tasks/perf-before.json`](tasks/perf-before.json), [`tasks/perf-after.json`](tasks/perf-after.json).

## What shipped

1. **Parse: avoid copying string inputs** — only coerce with `` `${text}` `` when the value is not already a string (preserves `TypeError` on `Symbol`).
2. **Parse: skip `strip` when it cannot help** — after a failed native `JSON.parse`, a string-aware scan looks for comments (`//`, `/*`) or trailing commas outside strings. If neither exists, rethrow the native error immediately (no grammar pass).
3. **Lookup: fewer allocations** — ignored/delimiter tokens are only materialized when they cover the cursor; parent literal children are built in one pass.
4. **Lookup (full scan): slice instead of detokenize** — parent values use `text.slice(start, end)` + `parse` instead of rebuilding via `detokenize`.

### Attempted and reverted

Deferred string joining in `strip` (chunk/part trees joined only at `Root`) was implemented and measured. On the ~100KB commented fixture it was **~1.3–2× slower** than nested `values.join("")` (extra array/tree overhead dominated any join savings for this grammar). That change was reverted; strip behavior matches the pre-change implementation.

## Results (mean latency)

Positive Δ% = faster (lower mean ms).

| Benchmark                             | Before (ms) | After (ms) |   Speedup |         Δ% |
| ------------------------------------- | ----------: | ---------: | --------: | ---------: |
| `parse.invalid`                       |      0.0101 |     0.0028 | **3.61×** | **+72.3%** |
| `validate.withErrors`                 |      1.8487 |     0.4141 | **4.46×** | **+77.6%** |
| `parse.withoutComments`               |      0.1302 |     0.1273 |     1.02× |      +2.2% |
| `parse.nativeBaseline` (`JSON.parse`) |      0.1308 |     0.1244 |         — |          — |
| `parse.withComments`                  |      1.8486 |     1.9314 |     0.96× |      −4.5% |
| `validate.withComments`               |      1.8375 |     1.8019 |     1.02× |      +1.9% |
| `lookup.start` (pos 150)              |      0.0378 |     0.0358 |     1.06× |      +5.3% |
| `lookup.middle` (pos 41111)           |      3.5925 |     3.4544 |     1.04× |      +3.8% |
| `lookup.end` (pos 92900)              |      7.4788 |     7.5652 |     0.99× |      −1.2% |
| `lookup.fullScanMiddle`               |      8.6542 |     8.5807 |     1.01× |      +0.8% |

### Throughput (ops/sec from mean)

| Benchmark               | Before (Hz) |  After (Hz) |
| ----------------------- | ----------: | ----------: |
| `parse.invalid`         |      98,873 | **354,045** |
| `validate.withErrors`   |         541 |   **2,415** |
| `parse.withoutComments` |       7,681 |       7,858 |
| `parse.withComments`    |         541 |         518 |
| `lookup.middle`         |         278 |         289 |

## Interpretation

### Clear wins

- **`parse.invalid` (~3.6×)** and **`validate.withErrors` (~4.5×)** — these inputs fail native `JSON.parse` and have no comments/trailing commas. The probe skips the full strip grammar walk that previously ran on every failure.
- **Plain JSON (`parse.withoutComments`)** stays within noise of native `JSON.parse` (~0.13 ms on ~100KB). No regression on the hot success path.

### Small / noise-level

- **Lookup** improvements are modest (≈0–5%). Tokenize-to-position still dominates (~90% of lookup time); allocation trimming only helps the smaller second pass.
- **`parse.withComments` / `validate.withComments`** are unchanged in architecture (still strip → re-parse). Observed ± a few percent is measurement noise, not a meaningful regression or win.

### Tradeoff

Skipping strip on pure-invalid JSON means those errors surface as **native `JSON.parse` `SyntaxError` messages** instead of strip/tokenizer `JSONC` messages. Inputs that actually use comments or trailing commas still go through strip and keep JSONC-specific errors.

## Takeaway

The definite, measured gains are on **failed parses that are not JSONC** (invalid JSON, error fixtures): roughly **3.5–4.5× fewer milliseconds** spent rejecting them. The success path for plain JSON and the strip path for real JSONC remain essentially the same speed as before.
