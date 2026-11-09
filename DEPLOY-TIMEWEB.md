# Timeweb (автодеплой)

**GitHub:** `NikitaErmilovv/Aliento`, ветка **`main`**.

| Этап | Команда |
|------|---------|
| Установка | `npm ci` |
| Сборка | `npm run build` |
| Запуск | `npm run start` (порт из окружения, обычно `PORT`) |

`NODE_ENV=production` — по желанию.

## Учётки после первого старта

Если **`data/aliento.json` нет**, при старте копируется **`data/aliento.initial.json`** (твои ученики и staff, без демо).

Пароль у тестовых staff и `uch-…@aliento.test`: **`aliento123`**.

| Роль | Логин |
|------|--------|
| Владелец | `owner@aliento.test` |
| Админ | `admin@aliento.test` |
| Препод | `anastasia@aliento.test`, `alexander@aliento.test` |
| Ученик | `student@aliento.test` + созданные `uch-…` |

Если на сервере **старая демо-база** — в консоли один раз: `rm -f data/aliento.json`, перезапуск.

**Данные дальше** только в `data/aliento.json` на диске — бэкапь перед деплоем.
