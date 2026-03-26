import express from "express";
import * as controller from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import {createUserSchemas, paramsUserSchemas, updateUserPutSchemas, updateUserPatchSchemas} from "../schemas/user.schemas.js"


const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Отримати всіх користувачів
 *     responses:
 *       200:
 *         description: Список користувачів
 */
router.get("/", validate({}), controller.getUsersController)

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Отримати користувача за ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Користувач знайдений
 *       404:
 *         description: Не знайдено
 */
router.get("/:id", validate({params: paramsUserSchemas}),controller.getUserByIdController)

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Створити користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Створено
 */
router.post("/", validate({body: createUserSchemas}), controller.addUserController)

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Часткове оновлення користувача
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Оновлено
 */
router.patch("/:id", validate({params: paramsUserSchemas, body: updateUserPatchSchemas}), controller.updateUserPatchController)

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Повне оновлення користувача
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Оновлено
 */
router.put("/:id", validate({params: paramsUserSchemas, body: updateUserPutSchemas}), controller.updateUserPutController)

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Видалити користувача
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Видалено
 */
router.delete("/:id", validate({params: paramsUserSchemas}), controller.deleteUserController)



export default router;
