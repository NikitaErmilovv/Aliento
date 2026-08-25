/** Shared demo-mode helpers for the JSON store. */

export type DemoFlag = { isDemo?: boolean };

export function isDemoMode(settings: { demoMode?: boolean }) {
  return settings.demoMode !== false;
}

export function filterDemo<T extends DemoFlag>(items: T[], demoOn: boolean) {
  if (demoOn) return items;
  return items.filter((item) => !item.isDemo);
}

export function filterStudents(users: { role: string; isDemo?: boolean }[], demoOn: boolean) {
  if (demoOn) return users.filter((u) => u.role === "STUDENT");
  return users.filter((u) => u.role === "STUDENT" && !u.isDemo);
}
