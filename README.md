# FIT WebApp API — Професійний README (Навчальний бекенд + Security Showcase)

Цей проєкт — навчальний REST API для керування подіями, користувачами та їхніми реєстраціями. Код демонструє коректні інженерні практики (DTO/валідація, централізовані помилки, пагінація, JOIN/COUNT, спрощені міграції, сидування), а також містить навмисно вразливий endpoint для демонстрації SQL Injection виключно в освітніх цілях.

Посилання після запуску (PORT=3000 за замовчуванням):
- Health‑check: http://localhost:3000/health
- Swagger UI: http://localhost:3000/api/docs

## 1) About & Architecture
- Стек: Node.js 18+, Express 5 (ESM), TypeScript
- БД: SQLite (драйвер sqlite3), файл БД створюється автоматично
- Валідація: Zod (через middleware validate)
- Документація: swagger-jsdoc + swagger-ui-express
- Аутентифікація/Паролі: bcryptjs (хешування паролів користувачів при створенні/оновленні)
- Логування: простий middleware (метод, шлях, статус, тривалість)

Архітектурні шари:
- Routes — визначають HTTP-шляхи і вішають middleware/контролери (Backend/src/routes/*).
- Controllers — приймають запити, дістають провалідовані дані з res.locals, викликають сервіси, формують HTTP-відповідь (Backend/src/controllers/*).
- Services — бізнес-логіка, агрегації, обробка помилок SQLite → AppError (Backend/src/service/*).
- Repositories — SQL доступ до БД, тільки параметризовані запити (all/get/run) за замовчуванням (Backend/src/repository/*).
- DTO/Schemas — типи, Zod-схеми, мапінг DB DTO → View DTO (Backend/src/dto/*, Backend/src/schemas/*, dto.func.ts).
- Errors — AppError, asyncHandler, globalErrorHandler з єдиним форматом помилки (Backend/src/errors/*).
- DB — db.ts (створює/відкриває SQLite, PRAGMA foreign_keys=ON), dbClient.ts (all/get/run як проміси), migrate.ts (раннер спрощених міграцій), seed.ts (первинні дані) (Backend/src/db/*).

Патерн відповіді для списків: { data, total }
- data — масив View DTO
- total — загальна кількість записів, що відповідають фільтрам (Events — через окремий COUNT(*))

## 2) Database Architecture
Файлова БД SQLite: Backend\src\data\app.db

Ключові таблиці, зв’язки та обмеження:
- Users: UNIQUE(email), NOT NULL поля; роль за замовчуванням USER.
- Events: UNIQUE(name), CHECK(capacity > 0 AND capacity < 200).
- Registrations: UNIQUE(user_id, event_id), FK → Users/Events.
- ON DELETE CASCADE: Users → Registrations; ON DELETE RESTRICT: Events → Registrations.


## 3) API Reference
Усі спискові ендпоінти повертають { data, total }. Є централізований error handler з форматом:
```json
{
  "error": { "code": "NOT_FOUND", "message": "Route not found", "details": null }
}
```

- Events
  - GET /api/events — список з фільтрацією/сортуванням/пагінацією
    - Query: search?, sortBy? (number_sorter|name_sorter|capacity_sorter|date_sorter), limit?, offset?
    - Відповідь 200 (json):
```json
{ "data": [ { "id": 1, "name": "JS Conf", "date": "2027-04-15T10:00:00.000Z", "location": "Kyiv", "capacity": 100, "description": "..." } ], "total": 37 }
```
  - GET /api/events/:id — 200 | 404
  - POST /api/events — 201 (валідація createEventSchema)
  - PATCH /api/events/:id — 200 | 400 | 404
  - PUT /api/events/:id — 200 | 400 | 404
  - DELETE /api/events/:id — 204 | 404
  - GET /api/events/:id/registrations/count — 200 → { "count": number }

- Users
  - GET /api/users — 200 → { data, total }
  - GET /api/users/:id — 200 | 404
  - GET /api/users/:id/registrations — JOIN Registrations+Events, 200 → { data, total }
  - POST /api/users — 201 (пароль хешується)
  - PATCH /api/users/:id — 200 | 400 | 404
  - PUT /api/users/:id — 200 | 400 | 404
  - DELETE /api/users/:id — 204 | 404

- Registrations
  - GET /api/registrations — 200 → { data, total }
  - GET /api/registrations/:id — 200 | 404
  - POST /api/registrations — 201 | 404 | 409
  - PATCH /api/registrations/:id — 200 | 400 | 404
  - PUT /api/registrations/:id — 200 | 400 | 404
  - DELETE /api/registrations/:id — 204 | 404

Розділ «Security Research & Penetration Testing» — нижче.

## 4) The SQL Injection Showcase (навмисна вразливість)
У проєкті присутній спец-ендпоінт ТІЛЬКИ для демонстрації SQL Injection.

- Endpoint: GET /api/events/unsafe/:id
- Чому вразливий: будує SQL через конкатенацію рядків без плейсхолдерів (parameter binding відсутній), що дозволяє змінювати WHERE.

Вразливий код (уривок):
```ts
const sql = `SELECT event_id, name, date, location, capacity, description
             FROM Events
             WHERE event_id = ${id}`; // НЕБЕЗПЕЧНО!
```

Payload для експлуатації (обхід фільтра, повертає всі рядки):
```bash
curl -i "http://localhost:3000/api/events/unsafe/1 OR 1=1"
```
Фактичний SQL:
```sql
SELECT event_id, name FROM Events WHERE event_id = 1 OR 1=1;
```

Як ПОВИННО бути (безпечний, параметризований запит):
```ts
await get("SELECT event_id, name FROM Events WHERE event_id = ?", [Number(id)]);
```
Або для LIKE-пошуку за назвою:
```ts
await all(
  "SELECT event_id, name FROM Events WHERE LOWER(name) LIKE ? ORDER BY name ASC LIMIT ? OFFSET ?",
  [ `%${search.toLowerCase()}%`, limit, offset ]
);
```

У продакшені подібні ендпоінти мають бути відсутні. Цей — лише для навчальної демонстрації.

- Security-тест (SQLi) — ручна перевірка:
```bash
# Звичайний запит (id=1)
curl -i http://localhost:3000/api/events/unsafe/1

# SQLi: поверне всі події
curl -i "http://localhost:3000/api/events/unsafe/1 OR 1=1"
```

- Перевірка WHERE+ORDER+LIMIT (фільтри/сортування/пагінація):
```bash
curl -G http://localhost:3000/api/events \
  --data-urlencode "search=js" \
  --data-urlencode "sortBy=name_sorter" \
  --data-urlencode "limit=5" \
  --data-urlencode "offset=0"
```

## 6) Local Setup (міграції та сидування)
Вимоги: Node.js 18+, npm

1) Встановити залежності
```bash
cd Backend
npm i


2) Налаштувати порт (необов’язково)
- Створіть .env і задайте PORT=3000 (або інший)

3) Міграції (спрощений раннер)
- SQL-файли зберігаються у Backend/src/migrations/
- Запуск:
```bash
npm run migrate
```
Runner застосує лише нові файли та зафіксує версії у schema_migrations.

4) Seed (первинні дані)
```bash
npm run seed
```
Seed очистить таблиці та додасть 3 Users, 3 Events, 4 Registrations (паролі — демо-хеш bcrypt).

5) Запустити сервер у dev-режимі (tsx watch)
```bash
npm run dev
```

6) Шляхи та корисні посилання
- Файл БД: Backend\src\data\app.db
- Health: GET /health
- Swagger UI: GET /api/docs

---
