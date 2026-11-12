import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { hashPassword, type User } from "../src/lib/db";
import { STAFF_EMAIL, staffBootstrapPassword } from "../src/lib/staff-bootstrap";

const rel = process.argv[2] || "data/aliento.initial.json";
const dataFile = join(process.cwd(), rel);

type Store = { users: User[]; [key: string]: unknown };

const store: Store = JSON.parse(readFileSync(dataFile, "utf8"));

const DEMO_STUDENT_LEGACY = new Set([
  "student@aliento.test",
  "student@aliento.dance",
  "maria.ivanova@student.aliento.dance",
]);

function patchUser(user: User, email: string, pwdKey: keyof typeof STAFF_EMAIL, name: string) {
  user.email = email;
  user.name = name;
  user.passwordHash = hashPassword(staffBootstrapPassword(pwdKey));
}

const owner = store.users.find((u) => u.role === "OWNER");
if (owner) patchUser(owner, STAFF_EMAIL.owner, "owner", "Владелец");

const admin = store.users.find((u) => u.role === "ADMIN");
if (admin) patchUser(admin, STAFF_EMAIL.admin, "admin", "Администратор");

const teachers = store.users
  .filter((u) => u.role === "TEACHER")
  .sort((a, b) => a.id.localeCompare(b.id));
if (teachers[0]) patchUser(teachers[0], STAFF_EMAIL.teacher1, "teacher1", "Преподаватель");
if (teachers[1]) patchUser(teachers[1], STAFF_EMAIL.teacher2, "teacher2", "Преподаватель 2");

const demoStudent =
  store.users.find((u) => u.role === "STUDENT" && DEMO_STUDENT_LEGACY.has(u.email)) ??
  store.users.find((u) => u.role === "STUDENT" && /^(ученик|тестовый ученик)/i.test(u.name.trim()));
if (demoStudent) patchUser(demoStudent, STAFF_EMAIL.demoStudent, "demoStudent", "Ученик");

writeFileSync(dataFile, JSON.stringify(store, null, 2));
console.log(`Updated staff bootstrap accounts in ${dataFile}`);
