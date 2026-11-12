# Timeweb (автодеплой)

**GitHub:** `NikitaErmilovv/Aliento`, ветка **`main`**.

| Этап | Команда |
|------|---------|
| Установка | `npm ci` |
| Сборка | `npm run build` |
| Запуск | `npm run start` (порт из окружения, обычно `PORT`) |

`NODE_ENV=production` — по желанию.

## Учётки staff

Если **`data/aliento.json` нет**, при старте копируется **`data/aliento.initial.json`**.

Пароли staff на проде можно задать через переменные `ALIENTO_BOOTSTRAP_*_PASSWORD` (см. `src/lib/staff-bootstrap.ts`). Логины на странице входа не показываются.

На уже работающем сервере с устаревшими `@aliento.test`:

```bash
npx tsx scripts/refresh-staff-bootstrap.ts data/aliento.json
```

Если нужен полностью чистый склад — `npx tsx scripts/reset-clean.ts` (стирает операционные данные).

**Данные дальше** только в `data/aliento.json` на диске — бэкапь перед деплоем.
