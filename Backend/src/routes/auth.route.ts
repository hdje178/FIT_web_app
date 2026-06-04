import express from "express";
import * as controller from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
const router = express.Router()
import {createUserSchemas, paramsUserSchemas, updateUserPutSchemas, updateUserPatchSchemas} from "../schemas/user.schemas.js"
import {loginSchema} from "../schemas/auth.schemas.js";
import {authMiddleware, alreadyAuthMiddleware} from "../middleware/auth.middleware.js";

router.post("/registration", validate({body: createUserSchemas }), controller.register);
router.post("/login", alreadyAuthMiddleware, validate({body: loginSchema }), controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", authMiddleware, controller.isUserAuthorised);
router.get("/me/profile", authMiddleware, controller.getProfile);
export default router;