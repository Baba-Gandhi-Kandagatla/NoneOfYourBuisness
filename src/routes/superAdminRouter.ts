import { Router } from "express";
import { verifyTokenSuperAdmin } from "../utils/token-manager.js";

const superAdminRouter = Router();

export default superAdminRouter;