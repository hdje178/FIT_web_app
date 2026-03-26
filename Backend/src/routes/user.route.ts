import express from "express";
import * as controller from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import {createUserSchemas, paramsUserSchemas, updateUserPutSchemas, updateUserPatchSchemas} from "../schemas/user.schemas.js"


const router = express.Router();

router.get("/", validate({}), controller.getUsersController)
router.get("/:id", validate({params: paramsUserSchemas}),controller.getUserByIdController)
router.post("/", validate({body: createUserSchemas}), controller.addUserController)
router.patch("/:id", validate({params: paramsUserSchemas, body: updateUserPatchSchemas}), controller.updateUserPatchController)
router.put("/:id", validate({params: paramsUserSchemas, body: updateUserPutSchemas}), controller.updateUserPutController)
router.delete("/:id", validate({params: paramsUserSchemas}), controller.deleteUserController)



export default router;
