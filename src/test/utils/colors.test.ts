import { describe, expect, it } from "bun:test";
import { join } from "node:path";

const PROBE_PATH = join(import.meta.dir, "../helpers/colorsProbe.ts");

interface ProbeOutput {
  cyan: string;
  green: string;
  red: string;
  yellow: string;
}

function buildEnv(overrides: Record<string, string>): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      env[key] = value;
    }
  }
  delete env.FORCE_COLOR;
  delete env.NO_COLOR;
  return { ...env, ...overrides };
}

function runProbe(env: Record<string, string>): ProbeOutput {
  const proc = Bun.spawnSync([process.execPath, PROBE_PATH], {
    env,
    stdout: "pipe",
    stderr: "pipe",
  });
  if (proc.exitCode !== 0) {
    throw new Error(`colors probe failed: ${proc.stderr.toString()}`);
  }
  return JSON.parse(proc.stdout.toString()) as ProbeOutput;
}

describe("colors", () => {
  it("wraps text in ANSI escape codes when color is enabled", () => {
    const output = runProbe(buildEnv({ FORCE_COLOR: "1" }));
    expect(output.cyan).toBe("\u001B[36mc\u001B[0m");
    expect(output.green).toBe("\u001B[32mg\u001B[0m");
    expect(output.red).toBe("\u001B[31mr\u001B[0m");
    expect(output.yellow).toBe("\u001B[33my\u001B[0m");
  });

  it("returns plain text when NO_COLOR is set", () => {
    const output = runProbe(buildEnv({ NO_COLOR: "1" }));
    expect(output.cyan).toBe("c");
    expect(output.green).toBe("g");
    expect(output.red).toBe("r");
    expect(output.yellow).toBe("y");
  });
});
