import { Router } from "express";
import { addCollege, addAdmin } from "../controllers/god-controller.js";
import { signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const godRouter = Router();

godRouter.post("/addAdmin",validate(signupValidator),addAdmin);
godRouter.post("/addCollege", addCollege);


export default godRouter;