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
    path: `/admin/students/${studentId}`,
  });
}

export async function takeIssuedStudentCredentials(
  studentId: string
): Promise<IssuedStudentCredentials | null> {
  const jar = await cookies();
  const key = cookieName(studentId);
  const raw = jar.get(key)?.value;
  if (!raw) return null;
  jar.delete(key);
  try {
    const parsed = JSON.parse(raw) as IssuedStudentCredentials;
    if (!parsed.login || !parsed.pass) return null;
    return parsed;
  } catch {
    return null;
  }
}
