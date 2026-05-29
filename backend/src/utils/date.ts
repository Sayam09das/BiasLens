export function nowIso(): string {
  return new Date().toISOString();
}

export function addMilliseconds(date: Date, ms: number): Date {
  return new Date(date.getTime() + ms);
}
