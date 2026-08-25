"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/actions/auth";
import { isAdmin } from "@/lib/format";
import { randomBytes } from "node:crypto";

export async function toggleDemoModeAction(enabled: boolean) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) return { error: "Недостаточно прав." };
  await prisma.settings.update({ data: { demoMode: enabled } });
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  return { ok: true };
}

function makeInviteCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function generateInviteCodeAction() {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) return { error: "Недостаточно прав." };
  let code = makeInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const exists = await prisma.inviteCode.findUnique({ where: { code } });
    if (!exists) break;
    code = makeInviteCode();
  }
  const row = await prisma.inviteCode.create({ data: { code } });
  revalidatePath("/admin/students");
  return { ok: true, code: row.code };
}

export async function grantTeacherRoleAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/settings?error=Недостаточно прав.");

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const title = String(formData.get("title") || "Преподаватель").trim();
  const description = String(formData.get("description") || "Преподаватель школы Aliento.").trim();

  if (!email) redirect("/admin/settings?error=Укажите email пользователя.");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/admin/settings?error=Пользователь с таким email не найден.");
  if (user.role === "OWNER") redirect("/admin/settings?error=Нельзя изменить роль владельца.");

  await prisma.user.update({ where: { id: user.id }, data: { role: "TEACHER" } });
  const existing = await prisma.teacher.findUnique({ where: { userId: user.id } });
  if (!existing) {
    await prisma.teacher.create({ data: { userId: user.id, title, description } });
  }

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function markAttendanceAction(bookingId: string, status: "PRESENT" | "ABSENT") {
  const staff = await requireStaff();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { class: { include: { teacher: true } }, attendance: true },
  });
  if (!booking || booking.status !== "BOOKED") return { error: "Запись не найдена." };
  if (staff.role === "TEACHER" && booking.class.teacher.userId !== staff.id) {
    return { error: "Можно отмечать только свои занятия." };
  }
  if (booking.attendance) return { error: "Посещение уже отмечено." };

  await prisma.attendance.create({
    data: {
      bookingId: booking.id,
      userId: booking.userId,
      classId: booking.classId,
      status,
    },
  });

  if (status === "PRESENT") {
    const sub = await prisma.subscription.findFirst({
      where: {
        userId: booking.userId,
        status: "ACTIVE",
        remainingClasses: { gt: 0 },
      },
      orderBy: { expiresAt: "asc" },
    });
    if (sub) {
      const remaining = sub.remainingClasses - 1;
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          remainingClasses: remaining,
          status: remaining <= 0 ? "EXHAUSTED" : "ACTIVE",
        },
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath("/cabinet");
  return { ok: true };
}

export async function toggleBlockUserAction(userId: string) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) return { error: "Недостаточно прав." };
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "Ученик не найден." };
  await prisma.user.update({ where: { id: userId }, data: { blocked: !user.blocked } });
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${userId}`);
  return { ok: true };
}

export async function createClassAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/classes?error=Недостаточно прав.");

  const title = String(formData.get("title") || "").trim();
  const level = String(formData.get("level") || "").trim();
  const teacherId = String(formData.get("teacherId") || "");
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const duration = Number(formData.get("duration") || 90);
  const room = String(formData.get("room") || "").trim();
  const capacity = Number(formData.get("capacity") || 20);

  if (!title || !level || !teacherId || !date || !time || !room) {
    redirect("/admin/classes?error=Заполните все поля занятия.");
  }

  const startsAt = new Date(`${date}T${time}`);
  if (Number.isNaN(startsAt.getTime())) {
    redirect("/admin/classes?error=Некорректная дата или время.");
  }
  const endsAt = new Date(startsAt.getTime() + duration * 60_000);

  await prisma.danceClass.create({
    data: {
      teacherId,
      title,
      level,
      description: `${title} — ${level.toLowerCase()}.`,
      startsAt,
      endsAt,
      room,
      capacity,
    },
  });

  revalidatePath("/admin/classes");
  revalidatePath("/schedule");
  revalidatePath("/");
  redirect("/admin/classes?created=1");
}

export async function deleteClassAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/classes?error=Недостаточно прав.");
  const id = String(formData.get("classId") || "");
  if (!id) redirect("/admin/classes?error=Занятие не найдено.");
  await prisma.danceClass.delete({ where: { id } });
  revalidatePath("/admin/classes");
  revalidatePath("/schedule");
  redirect("/admin/classes?deleted=1");
}

export async function createPlanAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/plans?error=Недостаточно прав.");

  const name = String(formData.get("name") || "").trim();
  const classCount = Number(formData.get("classCount") || 0);
  const durationDays = Number(formData.get("durationDays") || 0);
  const priceRub = Number(formData.get("priceRub") || 0);
  const description = String(formData.get("description") || "").trim();
  const popular = formData.get("popular") === "on";

  if (!name || classCount <= 0 || durationDays <= 0 || priceRub <= 0) {
    redirect("/admin/plans?error=Проверьте название, количество занятий, срок и цену.");
  }

  await prisma.plan.create({
    data: { name, classCount, durationDays, priceRub, popular, description },
  });

  revalidatePath("/admin/plans");
  revalidatePath("/subscriptions");
  revalidatePath("/");
  redirect("/admin/plans?created=1");
}

export async function togglePlanPopularAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/plans?error=Недостаточно прав.");
  const id = String(formData.get("planId") || "");
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) redirect("/admin/plans?error=Тариф не найден.");
  await prisma.plan.update({ where: { id }, data: { popular: !plan.popular } });
  revalidatePath("/admin/plans");
  revalidatePath("/subscriptions");
  redirect("/admin/plans");
}

export async function deletePlanAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/plans?error=Недостаточно прав.");
  const id = String(formData.get("planId") || "");
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/admin/plans");
  revalidatePath("/subscriptions");
  redirect("/admin/plans?deleted=1");
}

export async function cancelSubscriptionAction(subscriptionId: string) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) return { error: "Недостаточно прав." };

  const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) return { error: "Абонемент не найден." };
  if (sub.status !== "ACTIVE") return { error: "Можно деактивировать только активный абонемент." };

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "CANCELLED", remainingClasses: 0 },
  });

  await prisma.notification.create({
    data: {
      userId: sub.userId,
      title: "Абонемент отменён",
      body: `Абонемент «${sub.plan.name}» деактивирован администратором школы.`,
    },
  });

  revalidatePath("/admin/plans");
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${sub.userId}`);
  revalidatePath("/cabinet");
  revalidatePath("/cabinet/subscriptions");
  return { ok: true };
}

export async function deleteSubscriptionAction(subscriptionId: string) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) return { error: "Недостаточно прав." };

  const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) return { error: "Абонемент не найден." };

  await prisma.subscription.delete({ where: { id: subscriptionId } });

  revalidatePath("/admin/plans");
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${sub.userId}`);
  revalidatePath("/cabinet");
  revalidatePath("/cabinet/subscriptions");
  return { ok: true };
}

export async function broadcastMessageAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/messages?error=Недостаточно прав.");

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const audience = String(formData.get("audience") || "students");

  if (!title || !body) redirect("/admin/messages?error=Заполните заголовок и текст.");

  const recipients = await prisma.user.findMany(
    audience === "staff" ? { where: { roleIn: ["TEACHER", "ADMIN", "OWNER"] } } : { where: { role: "STUDENT" } }
  );

  for (const person of recipients) {
    await prisma.notification.create({ data: { userId: person.id, title, body } });
  }

  revalidatePath("/admin/messages");
  revalidatePath("/cabinet/notifications");
  redirect(`/admin/messages?sent=${recipients.length}`);
}

export async function updateSettingsAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/settings?error=Недостаточно прав.");

  await prisma.settings.update({
    data: {
      schoolName: String(formData.get("schoolName") || "").trim(),
      slogan: String(formData.get("slogan") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      hours: String(formData.get("hours") || "").trim(),
      cancelHours: Number(formData.get("cancelHours") || 4),
      trialPriceRub: Number(formData.get("trialPriceRub") || 0),
    },
  });

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

import { fulfillPlanPayment } from "@/lib/fulfill-payment";

export async function confirmPaymentAction(formData: FormData) {
  const staff = await requireStaff();
  if (!isAdmin(staff.role)) redirect("/admin/payments?error=Недостаточно прав.");
  const id = String(formData.get("paymentId") || "");
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) redirect("/admin/payments?error=Платёж не найден.");

  if (payment.planId && payment.status === "PENDING") {
    const result = await fulfillPlanPayment(id);
    if ("error" in result) {
      redirect(`/admin/payments?error=${encodeURIComponent(result.error ?? "Ошибка")}`);
    }
  } else {
    await prisma.payment.update({ where: { id }, data: { status: "PAID" } });
  }

  revalidatePath("/admin/payments");
  redirect("/admin/payments?confirmed=1");
}
