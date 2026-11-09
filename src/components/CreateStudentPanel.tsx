"use client";

import { SubmitButton } from "@/components/ButtonLink";
import { createStudentByAdminAction } from "@/actions/admin";
import { MaskedBirthDateInput } from "@/components/MaskedBirthDateInput";
import { MaskedPhoneInput } from "@/components/MaskedPhoneInput";

export function CreateStudentPanel() {
  return (
    <section className="app-card">
      <h2 className="app-card-title">Создать ученика</h2>
      <p className="mt-2 text-sm text-muted">
        Логин и пароль сгенерируются автоматически (email можно не указывать). Ученик сразу сможет войти
        в личный кабинет с этими данными.
      </p>
      <form action={createStudentByAdminAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="field-label" htmlFor="studentName">
            Имя и фамилия
          </label>
          <input id="studentName" name="name" required className="field" placeholder="Анна Петрова" />
        </div>
        <div>
          <label className="field-label" htmlFor="studentPhone">
            Телефон
          </label>
          <MaskedPhoneInput id="studentPhone" name="phone" required />
        </div>
        <div>
          <label className="field-label" htmlFor="studentDob">
            Дата рождения <span className="text-muted">(необязательно)</span>
          </label>
          <MaskedBirthDateInput id="studentDob" name="dateOfBirth" />
        </div>
        <div className="md:col-span-2">
          <label className="field-label" htmlFor="studentEmail">
            Email для входа <span className="text-muted">(необязательно)</span>
          </label>
          <input
            id="studentEmail"
            name="email"
            type="email"
            className="field"
            placeholder="Оставьте пустым — сгенерируем автоматически"
          />
        </div>
        <div className="md:col-span-2">
          <SubmitButton>Создать ученика</SubmitButton>
        </div>
      </form>
    </section>
  );
}
