## 🚀 REST API сервера — Лабораторна робота №2

Навчальний бекенд‑проєкт із розробки HTTP REST API. Особливість: бекенд працює без бази даних (In‑memory storage) — дані зберігаються у масивах у межах сесії сервера й зникають після перезапуску процесу.

Реалізовано:
- Повний CRUD для сутностей Events, Users, Registrations
- DTO та валідацію вхідних даних (Zod + middleware validate)
- Централізований Global Error Handling
- Логування запитів (метод, шлях, статус, тривалість)
- Swagger UI з ручною OpenAPI специфікацією

Посилання після запуску (PORT=3000 за замовчуванням):
- Health‑check: http://localhost:3000/health
- Swagger UI: http://localhost:3000/api/docs

## 🧰 Технологічний стек
- Node.js + Express (ESM)
- TypeScript
- Zod — валідація DTO
- Swagger UI — документація (ручний опис у Backend/src/swagger.ts)
- CORS, dotenv, uuid

## 🧱 Огляд архітектури
Проєкт реалізовано за принципом розділення обов'язків:
- Controller — приймає HTTP‑запити, викликає сервіси, формує HTTP‑відповіді.
- Service — містить бізнес‑логіку та працює з in‑memory сховищем (масиви в пам'яті).
- DTO/Schema — описує структуру даних і правила валідації (Zod), застосовується у middleware validate.
- Middleware — логування, парсинг JSON, валідація, глобальна обробка помилок.

Структура (скорочено):
- Backend/src/server.ts — точка входу, middleware, маршрути, Swagger.
- Backend/src/routes/* — маршрути (events, users, registrations).
- Backend/src/controllers/* — контролери HTTP‑рівня.
- Backend/src/services/* — бізнес‑логіка та робота з пам'яттю.
- Backend/src/schemas/* — Zod‑схеми DTO/валідації.
- Backend/src/errors/* — глобальний обробник помилок.
- Backend/src/swagger.ts — ручний опис OpenAPI.

## 🧾 Опис моделей даних (DTO)
Поля id генеруються на сервері (uuid). Дати — ISO 8601.

- EventCreateDTO (POST /api/events):
  - name: string (обов'язково)
  - capacity: number (обов'язково, максимум 200)
  - date: string ISO (обов'язково, майбутня дата)
  - location: string (обов'язково)
  - description: string (обов'язково)

- EventPutDTO (PUT /api/events/{id}) — повне оновлення; вимагає всі обов'язкові поля як при створенні.

- UserCreateDTO (POST /api/users):
  - name: string (обов'язково)
  - email: string (обов'язково, формат email)

- UserPutDTO (PUT /api/users/{id}) — повне оновлення; вимагає всі обов'язкові поля як при створенні.

- RegistrationCreateDTO (POST /api/registrations):
  - eventId: string (обов'язково, має існувати)
  - userId: string (обов'язково, має існувати)

Примітка: Часткові оновлення (PATCH) для events/users також підтримуються, але нижче зосереджено мінімальний набір операцій за завданням.

## 📚 Документація API (Ендпоінти)
Код успіху — очікуваний статус при валідному запиті згідно з поточною реалізацією.

| Метод | Шлях | Опис | Код успіху |
|------|------|------|------------|
| GET | /health | Перевірка стану сервера | 200        |
| GET | /api/events | Отримати всі події | 200        |
| GET | /api/events/{id} | Отримати подію за ID | 200        |
| POST | /api/events | Створити подію | 201        |
| PUT | /api/events/{id} | Повністю оновити подію | 200        |
| DELETE | /api/events/{id} | Видалити подію | 204        |
| GET | /api/users | Отримати всіх користувачів | 200        |
| GET | /api/users/{id} | Отримати користувача за ID | 200        |
| POST | /api/users | Створити користувача | 201        |
| PUT | /api/users/{id} | Повністю оновити користувача | 200        |
| DELETE | /api/users/{id} | Видалити користувача | 204        |
| GET | /api/registrations | Отримати всі реєстрації | 200        |
| GET | /api/registrations/{id} | Отримати реєстрацію за ID | 200        |
| POST | /api/registrations | Створити реєстрацію | 201        |
| DELETE | /api/registrations/{id} | Видалити реєстрацію | 204        |

Примітка: Семантично для видалення коректний код — 204 No Content (без тіла). Поточні контролери також повертають 204.

## 🧪 Тестування через cURL (готові приклади)
Замість <ID> підставте реальні значення з відповідей сервера.

### Events
- Отримати всі:
```bash
curl -X GET http://localhost:3000/api/events
```
- Отримати за ID:
```bash
curl -X GET http://localhost:3000/api/events/<EVENT_ID>
```
- Створити (POST із JSON‑тілом):
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JS Conference",
    "capacity": 100,
    "date": "2026-04-15T10:00:00.000Z",
    "location": "Kyiv",
    "description": "JavaScript community meetup"
  }'
```
- Повне оновлення (PUT):
```bash
curl -X PUT http://localhost:3000/api/events/<EVENT_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JS Conf 2026",
    "capacity": 150,
    "date": "2026-04-16T10:00:00.000Z",
    "location": "Lviv",
    "description": "Updated agenda"
  }'
```
- Видалення:
```bash
curl -X DELETE http://localhost:3000/api/events/<EVENT_ID>
```

### Users
- Отримати всіх:
```bash
curl -X GET http://localhost:3000/api/users
```
- Отримати за ID:
```bash
curl -X GET http://localhost:3000/api/users/<USER_ID>
```
- Створити:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ivan Petrenko",
    "email": "ivan.petrenko@example.com"
  }'
```
- Повне оновлення (PUT):
```bash
curl -X PUT http://localhost:3000/api/users/<USER_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ivan P.",
    "email": "ivan.p@example.com"
  }'
```
- Видалення:
```bash
curl -X DELETE http://localhost:3000/api/users/<USER_ID>
```

### Registrations
- Отримати всі:
```bash
curl -X GET http://localhost:3000/api/registrations
```
- Отримати за ID:
```bash
curl -X GET http://localhost:3000/api/registrations/<REG_ID>
```
- Створити:
```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "<EVENT_ID>",
    "userId": "<USER_ID>"
  }'
```
- Видалення:
```bash
curl -X DELETE http://localhost:3000/api/registrations/<REG_ID>
```

### ❌ Приклад запиту, що викликає помилку (валідація 400)
Неправильний email при створенні користувача:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bad User",
    "email": "not-an-email"
  }'
```
Очікування: 400 Bad Request з описом помилки валідації (DTO відхилено middleware validate/Zod).

## ⚠️ Обробка помилок та статус‑коди
- 201 Created — успішне створення ресурсу (POST). Тіло відповіді містить створений об'єкт із id.
- 204 No Content — успішне видалення без тіла відповіді. У поточній реалізації видалення повертає 200 OK; за потреби можна змінити контролери, щоб відправляти 204 без тіла.
- 400 Bad Request — помилка валідації DTO (наприклад, відсутні обов'язкові поля, неправильні типи/формати).
- 404 Not Found — ресурс із вказаним ID не існує.
- 500 Internal Server Error — непередбачена помилка на сервері.

Централізований обробник помилок: Backend/src/errors/global.errors_handler.ts. Логування запитів здійснюється middleware у server.ts (метод, шлях, статус, тривалість).

## 🛠️ Інструкція із запуску
1) Перейдіть у директорію Backend
```bash
cd Backend
```
2) Встановіть залежності
```bash
npm install
```
3) Запуск у розробці (TS через tsx):
```bash
npm run dev
```
Або зібрати та запустити з dist:
```bash
npm run build
npm start
```
4) Змінні оточення (необов'язково): PORT (за замовчуванням 3000)

Після запуску:
- Health‑check: http://localhost:3000/health
- Swagger UI: http://localhost:3000/api/docs

## 🧭 Тестування
- Postman / Insomnia — імпортуйте запити або використовуйте приклади з цього README.
- cURL — див. розділ «Тестування через cURL». Урахуйте, що In‑memory дані зникають після перезапуску сервера.