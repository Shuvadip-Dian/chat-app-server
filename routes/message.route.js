import express from "express";
import isAthenticated from "../middleware/auth.middleware.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(isAthenticated,sendMessage)
router.route("/:id").get(isAthenticated,getMessage)

export default router