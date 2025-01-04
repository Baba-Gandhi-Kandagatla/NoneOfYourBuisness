import { Router } from "express";
import { verifyTokenAdmin } from "../utils/token-manager.js";

const adminRouter = Router();

export default adminRouter;