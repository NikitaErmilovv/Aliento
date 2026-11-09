import { SubmitButton } from "@/components/ButtonLink";
import { createStudentByAdminAction } from "@/actions/admin";

export function CreateStudentPanel() {
  return (
    <section className="app-card">
      <h2 className="app-card-title">Создать ученика</h2>
      <p className="mt-2 text-sm text-muted">
        Логин и пароль сгенерируются автоматически (email можно не указывать). Передайте их ученику для
        входа в личный кабинет.
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
          <input
            id="studentPhone"
            name="phone"
            type="tel"
            required
            className="field"
            placeholder="+7 900 000-00-00"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="studentDob">
            Дата рождения
          </label>
          <input id="studentDob" name="dateOfBirth" type="date" required className="field" />
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
