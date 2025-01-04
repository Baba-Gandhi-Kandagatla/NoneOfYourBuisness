import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { logout, verifyUser } from "../controllers/statusController.js";
import studentRouter from "./studentRouter.js";
import adminRouter from "./adminRouter.js";
import interviewRouter from "./interviewRouter.js";
import superAdminRouter from "./superAdminRouter.js";

const router = Router();

router.use("/student",studentRouter);
router.use("/admin",adminRouter);
router.use("/interview",interviewRouter);
router.use("/superAdmin",superAdminRouter);


router.get("/logout",logout);
router.get("/auth_status",verifyToken,verifyUser);


export default router;