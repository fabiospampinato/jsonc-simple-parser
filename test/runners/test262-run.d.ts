export interface Test262Failure {
  file: string;
  scenario: string;
  message: string | undefined;
}

export interface Test262RunResult {
  passed: number;
  failed: number;
  failures: Test262Failure[];
}

export interface RunTest262Options {
  preludePath: string;
  patterns: readonly string[];
  threads?: number;
  timeout?: number;
  reporter?: "simple" | "silent";
}

export function runTest262(options: RunTest262Options): Promise<Test262RunResult>;
