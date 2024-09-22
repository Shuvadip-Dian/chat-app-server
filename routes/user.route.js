import express from "express";
import { 
    userRegister,
    userLogin,
    userLogout,
    getOtherUser
} from "../controllers/user.controller.js";
import isAthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/").get(isAthenticated,getOtherUser);


export default router