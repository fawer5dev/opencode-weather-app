const CYAN = "\u001B[36m";
const YELLOW = "\u001B[33m";
const GREEN = "\u001B[32m";
const RED = "\u001B[31m";
const RESET = "\u001B[0m";

const enabled = (() => {
  if (process.env.NO_COLOR !== undefined) return false;
  const force = process.env.FORCE_COLOR;
  if (force !== undefined) return force !== "0";
  return process.stdout.isTTY === true;
})();

function wrap(code: string, text: string): string {
  return enabled ? `${code}${text}${RESET}` : text;
}

export function cyan(text: string): string {
  return wrap(CYAN, text);
}

export function yellow(text: string): string {
  return wrap(YELLOW, text);
}

export function green(text: string): string {
  return wrap(GREEN, text);
}

export function red(text: string): string {
  return wrap(RED, text);
}
