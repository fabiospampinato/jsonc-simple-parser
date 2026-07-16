import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { bench, describe } from "vitest";
import JSON5 from "json5";
import VSCJSONC from "jsonc-parser";
import JSONC from "../src/index";

const sampleInvalid = readFileSync(resolve("tasks/sample_invalid.json"), "utf8");
const sampleWithComments = readFileSync(resolve("tasks/sample_with_comments.json"), "utf8");
const sampleWithErrors = readFileSync(resolve("tasks/sample_with_errors.json"), "utf8");
const sampleWithoutComments = readFileSync(resolve("tasks/sample_without_comments.json"), "utf8");

describe("Parse Invalid", () => {
  bench("JSONC.parse", () => {
    try {
      JSONC.parse(sampleInvalid);
    } catch {}
  });

  bench("JSONC.parse (VSC)", () => {
    try {
      VSCJSONC.parse(sampleInvalid);
    } catch {}
  });

  bench("JSON5.parse", () => {
    try {
      JSON5.parse(sampleInvalid);
    } catch {}
  });
});

describe("Parse With Comments", () => {
  bench("JSONC.parse", () => {
    JSONC.parse(sampleWithComments);
  });

  bench("JSONC.parse (VSC)", () => {
    VSCJSONC.parse(sampleWithComments);
  });

  bench("JSON5.parse", () => {
    JSON5.parse(sampleWithComments);
  });
});

describe("Parse Without Comments", () => {
  bench("JSONC.parse", () => {
    JSONC.parse(sampleWithoutComments);
  });

  bench("JSONC.parse (VSC)", () => {
    VSCJSONC.parse(sampleWithoutComments);
  });

  bench("JSON5.parse", () => {
    JSON5.parse(sampleWithoutComments);
  });

  bench("JSON.parse", () => {
    JSON.parse(sampleWithoutComments);
  });
});

describe("Lookup Start", () => {
  bench("JSONC.lookup", () => {
    JSONC.lookup(sampleWithoutComments, 150);
  });

  bench("JSONC.lookup (VSC)", () => {
    VSCJSONC.getLocation(sampleWithoutComments, 150);
  });
});

describe("Lookup Middle", () => {
  bench("JSONC.lookup", () => {
    JSONC.lookup(sampleWithoutComments, 41111);
  });

  bench("JSONC.lookup (VSC)", () => {
    VSCJSONC.getLocation(sampleWithoutComments, 41111);
  });
});

describe("Lookup End", () => {
  bench("JSONC.lookup", () => {
    JSONC.lookup(sampleWithoutComments, 92900);
  });

  bench("JSONC.lookup (VSC)", () => {
    VSCJSONC.getLocation(sampleWithoutComments, 92900);
  });
});

describe("Validate", () => {
  bench("JSON", () => {
    JSONC.validate(sampleWithoutComments);
  });

  bench("JSONC", () => {
    JSONC.validate(sampleWithComments);
  });

  bench("Errors", () => {
    JSONC.validate(sampleWithErrors);
  });
});
