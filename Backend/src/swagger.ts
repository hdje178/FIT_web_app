

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
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "JS Conference" },
                  capacity: { type: "number", example: 100 },
                  date: {
                    type: "string",
                    format: "date-time",
                    example: "2026-04-15T10:00:00.000Z",
                  },
                  location: { type: "string", example: "Kyiv" },
                  description: {
                    type: "string",
                    example: "JavaScript community meetup",
                  },
                },
                required: [
                  "name",
                  "capacity",
                  "date",
                  "location",
                  "description",
                ],
                additionalProperties: false,
              },
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "JS Conf 2026" },
                  capacity: { type: "number", example: 150 },
                  date: { type: "string", format: "date-time", example: "2026-04-16T10:00:00.000Z" },
                  location: { type: "string", example: "Lviv" },
                  description: { type: "string", example: "Updated agenda" },
                },
                required: ["name", "capacity", "date", "location", "description"],
                additionalProperties: false,
              },
            },
          },
        },
        responses: { 200: { description: "Оновлено" } },
      },
      patch: {
        tags: ["Events"],
        summary: "Часткове оновлення події",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  capacity: { type: "number" },
                  date: { type: "string", format: "date-time" },
                  location: { type: "string" },
                  description: { type: "string" },
                },
                additionalProperties: false,
              },
            },
          },
        },
        responses: { 200: { description: "Оновлено" } },
      },
      delete: {
        tags: ["Events"],
        summary: "Видалити подію",
        responses: { 204: { description: "No Content" } },
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
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Ivan Petrenko" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "ivan.petrenko@example.com",
                  },
                },
                required: ["name", "email"],
                additionalProperties: false,
              },
            },
          },
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Ivan P." },
                  email: { type: "string", format: "email", example: "ivan.p@example.com" },
                },
                required: ["name", "email"],
                additionalProperties: false,
              },
            },
          },
        },
        responses: { 200: { description: "Оновлено" } },
      },
      patch: {
        tags: ["Users"],
        summary: "Часткове оновлення користувача",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                },
                additionalProperties: false,
              },
            },
          },
        },
        responses: { 200: { description: "Оновлено" } },
      },
      delete: {
        tags: ["Users"],
        summary: "Видалити користувача",
        responses: { 204: { description: "No Content" } },
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
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string", example: "<USER_ID>" },
                  eventId: { type: "string", example: "<EVENT_ID>" },
                  status: {
                    type: "string",
                    enum: ["pending", "confirmed", "canceled"],
                    example: "pending",
                  },
                  description: { type: "string", example: "VIP seat" },
                },
                required: ["userId", "eventId"],
                additionalProperties: false,
              },
            },
          },
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
      put: {
        tags: ["Registrations"],
        summary: "Повне оновлення реєстрації",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "confirmed", "canceled"],
                    example: "confirmed",
                  },
                  description: { type: "string", example: "VIP seat" },
                },
                required: ["status", "description"],
                additionalProperties: false,
              },
            },
          },
        },
        responses: { 200: { description: "Оновлено" } },
      },
      patch: {
        tags: ["Registrations"],
        summary: "Часткове оновлення реєстрації",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "confirmed", "canceled"],
                  },
                  description: { type: "string" },
                },
                additionalProperties: false,
              },
            },
          },
        },
        responses: { 200: { description: "Оновлено" } },
      },
      delete: {
        tags: ["Registrations"],
        summary: "Видалити реєстрацію",
        responses: { 204: { description: "No Content" } },
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
