import { Router } from "express";
import { verifyTokenSuperAdmin } from "../utils/token-manager.js";
import * as superAdminController from "../controllers/superAdminController.js";
import {loginValidator, validate } from "../utils/validators.js";

const superAdminRouter = Router();

superAdminRouter.post("/login",validate(loginValidator),superAdminController.login);
superAdminRouter.post("/addSuperAdmin",verifyTokenSuperAdmin,superAdminController.addSuperAdmin);
superAdminRouter.post("/addCollege",verifyTokenSuperAdmin,superAdminController.addCollege);
superAdminRouter.post("/addAdmin",verifyTokenSuperAdmin,superAdminController.addAdmin);
superAdminRouter.get("/getColleges",verifyTokenSuperAdmin,superAdminController.getColleges);
superAdminRouter.get("/getAdmins/:collegeId",verifyTokenSuperAdmin,superAdminController.getAdminsByCollegeId);
superAdminRouter.get("/getSuperAdmins",verifyTokenSuperAdmin,superAdminController.getSuperAdmins);
superAdminRouter.delete("/deleteSuperAdmin/:superAdminId",verifyTokenSuperAdmin,superAdminController.deleteSuperAdmin);
superAdminRouter.delete("/deleteCollege/:collegeId",verifyTokenSuperAdmin,superAdminController.deleteCollege);
superAdminRouter.delete("/deleteAdmin/:adminId",verifyTokenSuperAdmin,superAdminController.deleteAdmin);

export default superAdminRouter;