import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { hashPassword, type User } from "../src/lib/db";
import { STAFF_EMAIL, staffBootstrapPassword } from "../src/lib/staff-bootstrap";

const rel = process.argv[2] || "data/aliento.initial.json";
const dataFile = join(process.cwd(), rel);

type Store = { users: User[]; [key: string]: unknown };

const store: Store = JSON.parse(readFileSync(dataFile, "utf8"));

const rules: Array<{ role: string; match: (u: User) => boolean; email: string; pwdKey: keyof typeof STAFF_EMAIL }> = [
  {
    role: "OWNER",
    match: (u) => u.role === "OWNER" || u.email === "owner@aliento.test",
    email: STAFF_EMAIL.owner,
    pwdKey: "owner",
  },
  {
    role: "ADMIN",
    match: (u) => u.role === "ADMIN" || u.email === "admin@aliento.test",
    email: STAFF_EMAIL.admin,
    pwdKey: "admin",
  },
  {
    role: "TEACHER",
    match: (u) =>
      u.role === "TEACHER" &&
      (u.email === "anastasia@aliento.test" || /анастасия/i.test(u.name)),
    email: STAFF_EMAIL.teacherAnastasia,
    pwdKey: "teacherAnastasia",
  },
  {
    role: "TEACHER",
    match: (u) =>
      u.role === "TEACHER" &&
      (u.email === "alexander@aliento.test" || /александр/i.test(u.name)),
    email: STAFF_EMAIL.teacherAlexander,
    pwdKey: "teacherAlexander",
  },
  {
    role: "STUDENT",
    match: (u) =>
      u.role === "STUDENT" &&
      (u.email === "student@aliento.test" || /тестовый ученик/i.test(u.name)),
    email: STAFF_EMAIL.demoStudent,
    pwdKey: "demoStudent",
  },
];

for (const rule of rules) {
  const user = store.users.find(rule.match);
  if (!user) continue;
  user.email = rule.email;
  user.passwordHash = hashPassword(staffBootstrapPassword(rule.pwdKey));
  if (rule.pwdKey === "demoStudent") {
    user.name = "Мария Иванова";
  }
}

writeFileSync(dataFile, JSON.stringify(store, null, 2));
console.log(`Updated staff bootstrap accounts in ${dataFile}`);
