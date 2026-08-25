"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { generateInviteCodeAction } from "@/actions/admin";

export function InviteCodesPanel({
  codes,
}: {
  codes: { id: string; code: string; createdAt: string; usedBy: string | null }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <section className="app-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="app-card-title">Ключи регистрации</h2>
          <p className="mt-2 text-sm text-muted">
            Выдайте ключ ученику — он сможет зарегистрироваться с ним на странице записи. Регистрация
            без ключа тоже доступна.
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await generateInviteCodeAction();
              router.refresh();
            });
          }}
          className="btn btn-primary btn-sm"
        >
          {pending ? "Создаём…" : "Создать ключ"}
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="data-table min-w-[480px]">
          <thead>
            <tr>
              <th>Ключ</th>
              <th>Создан</th>
              <th className="text-right">Статус</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && (
              <tr>
                <td colSpan={3} className="text-muted">
                  Ключей пока нет. Создайте первый ключ для ученика.
                </td>
              </tr>
            )}
            {codes.map((row) => (
              <tr key={row.id}>
                <td className="font-mono text-accent-300">{row.code}</td>
                <td>{new Date(row.createdAt).toLocaleDateString("ru-RU")}</td>
                <td className="text-right">
                  {row.usedBy ? (
                    <span className="badge badge-muted">Использован</span>
                  ) : (
                    <span className="badge badge-accent">Активен</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
