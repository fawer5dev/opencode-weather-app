import { spyOn } from "bun:test";
import { stripAnsi } from "./ansi";

export interface ConsoleCapture {
  lines(): string[];
  plain(): string;
  restore(): void;
}

export function captureConsoleLog(): ConsoleCapture {
  const lines: string[] = [];
  const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    lines.push(stripAnsi(args.map((arg) => String(arg)).join(" ")));
  });
  return {
    lines: () => [...lines],
    plain: () => lines.join("\n"),
    restore: () => spy.mockRestore(),
  };
}
