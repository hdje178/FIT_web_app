// Manual OpenAPI (Swagger) specification
// Повернено до ручного опису swagger, без автогенерації з JSDoc

export const swaggerSpec: Record<string, any> = {
  openapi: "3.0.3",
  info: {
    title: "FIT Webapp API",
    version: "1.0.0",
    description:
      "Ручна специфікація OpenAPI для Backend. Документація охоплює основні маршрути сервісу.",
  },
  servers: [
    { url: "/", description: "Current server (relative)" },
  ],
  tags: [
    { name: "Health", description: "Стан сервера" },
    { name: "Events", description: "Керування подіями" },
    { name: "Users", description: "Керування користувачами" },
    { name: "Registrations", description: "Реєстрації на події" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Перевірка стану сервера",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/events": {
      get: {
        tags: ["Events"],
        summary: "Отримати всі події",
        responses: { 200: { description: "Список подій" } },
      },
      post: {
        tags: ["Events"],
        summary: "Створити подію",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: { 201: { description: "Створено" } },
      },
    },
    "/api/events/{id}": {
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      get: {
        tags: ["Events"],
        summary: "Отримати подію за ID",
        responses: { 200: { description: "Подія" }, 404: { description: "Не знайдено" } },
      },
      put: {
        tags: ["Events"],
        summary: "Повне оновлення події",
        responses: { 200: { description: "Оновлено" } },
      },
      patch: {
        tags: ["Events"],
        summary: "Часткове оновлення події",
        responses: { 200: { description: "Оновлено" } },
      },
      delete: {
        tags: ["Events"],
        summary: "Видалити подію",
        responses: { 200: { description: "Видалено" } },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Отримати всіх користувачів",
        responses: { 200: { description: "Список користувачів" } },
      },
      post: {
        tags: ["Users"],
        summary: "Створити користувача",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 201: { description: "Створено" } },
      },
    },
    "/api/users/{id}": {
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["Users"],
        summary: "Отримати користувача за ID",
        responses: { 200: { description: "Користувач" }, 404: { description: "Не знайдено" } },
      },
      put: {
        tags: ["Users"],
        summary: "Повне оновлення користувача",
        responses: { 200: { description: "Оновлено" } },
      },
      patch: {
        tags: ["Users"],
        summary: "Часткове оновлення користувача",
        responses: { 200: { description: "Оновлено" } },
      },
      delete: {
        tags: ["Users"],
        summary: "Видалити користувача",
        responses: { 200: { description: "Видалено" } },
      },
    },
    "/api/registrations": {
      get: {
        tags: ["Registrations"],
        summary: "Отримати всі реєстрації",
        responses: { 200: { description: "Список реєстрацій" } },
      },
      post: {
        tags: ["Registrations"],
        summary: "Створити реєстрацію",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 201: { description: "Створено" } },
      },
    },
    "/api/registrations/{id}": {
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["Registrations"],
        summary: "Отримати реєстрацію за ID",
        responses: { 200: { description: "Реєстрація" }, 404: { description: "Не знайдено" } },
      },
      delete: {
        tags: ["Registrations"],
        summary: "Видалити реєстрацію",
        responses: { 200: { description: "Видалено" } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
