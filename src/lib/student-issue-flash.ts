import { cookies } from "next/headers";

const cookieName = (studentId: string) => `aliento-new-student-${studentId}`;

export type IssuedStudentCredentials = { login: string; pass: string };

export async function setIssuedStudentCredentials(
  studentId: string,
  creds: IssuedStudentCredentials
) {
  const jar = await cookies();
  jar.set(cookieName(studentId), JSON.stringify(creds), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/admin",
  });
}

/** Read-only: safe to call from Server Components (no cookie delete). */
export async function readIssuedStudentCredentials(
  studentId: string
): Promise<IssuedStudentCredentials | null> {
  const jar = await cookies();
  const raw = jar.get(cookieName(studentId))?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as IssuedStudentCredentials;
    if (!parsed.login || !parsed.pass) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearIssuedStudentCredentials(studentId: string) {
  const jar = await cookies();
  jar.delete(cookieName(studentId));
}
