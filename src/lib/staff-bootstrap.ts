export const STAFF_EMAIL = {
  owner: "director@aliento.dance",
  admin: "office@aliento.dance",
  teacherAnastasia: "anastasia.romova@aliento.dance",
  teacherAlexander: "alexander.din@aliento.dance",
  demoStudent: "maria.ivanova@student.aliento.dance",
} as const;

const ENV_KEYS = {
  owner: "ALIENTO_BOOTSTRAP_OWNER_PASSWORD",
  admin: "ALIENTO_BOOTSTRAP_ADMIN_PASSWORD",
  teacherAnastasia: "ALIENTO_BOOTSTRAP_TEACHER_ANASTASIA_PASSWORD",
  teacherAlexander: "ALIENTO_BOOTSTRAP_TEACHER_ALEXANDER_PASSWORD",
  demoStudent: "ALIENTO_BOOTSTRAP_DEMO_STUDENT_PASSWORD",
} as const;

type StaffKey = keyof typeof STAFF_EMAIL;

const FALLBACK: Record<StaffKey, string> = {
  owner: "Kp8#mQ2vLnWx4Rs9Yf",
  admin: "Ht5@wR7nJcVz3Mx6Bd",
  teacherAnastasia: "An4%pL9kRmTw2Hf8Qc",
  teacherAlexander: "Dx7!sN3vKpYj6Wm5Rt",
  demoStudent: "St6#vM2xLnQp9Kf4Wd",
};

export function staffBootstrapPassword(role: StaffKey): string {
  const fromEnv = process.env[ENV_KEYS[role]]?.trim();
  return fromEnv && fromEnv.length >= 8 ? fromEnv : FALLBACK[role];
}
