import express from "express";
import cors from "cors"
import "dotenv/config";
import type { Request, Response, Express } from "express";
import eventsRouter from "./routes/events.route.js";
import usersRouter from "./routes/user.route.js";
import registrationRouter from "./routes/registration.route.js";
import { globalErrorHandler } from "./errors/global.errors_handler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
});
app.use("/api/events", eventsRouter);
app.use("/api/users", usersRouter);
app.use("/api/registrations", registrationRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});
app.use(globalErrorHandler);
const server = app.listen(PORT, (): void =>
  console.log(`Server running on port ${PORT}`),
);
