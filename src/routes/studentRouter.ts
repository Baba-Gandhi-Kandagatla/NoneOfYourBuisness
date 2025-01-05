import { Router } from "express";
import { verifyTokenStudent } from "../utils/token-manager.js";
import { validate, loginValidator } from "../utils/validators.js";
import * as studentController from "../controllers/studentController.js";

const studentRouter = Router();

studentRouter.post("/login", validate(loginValidator), studentController.studentLogin);
studentRouter.get("/interviews", verifyTokenStudent, studentController.getAllInterviews);
studentRouter.get("/completedInterviews", verifyTokenStudent, studentController.getCompletedInterviews);
studentRouter.get("/resume", verifyTokenStudent, studentController.getResume);
studentRouter.post("/resume", verifyTokenStudent, studentController.uploadResume);
studentRouter.post("/changePassword", verifyTokenStudent, studentController.changePassword);
studentRouter.get("/interviewResult/:id", verifyTokenStudent, studentController.getInterwievResult);
studentRouter.post("/feedback", verifyTokenStudent, studentController.submitFeedback);
studentRouter.get("/feedback", verifyTokenStudent, studentController.getFeedback);
studentRouter.get("/attendance", verifyTokenStudent, studentController.getStudentAttendance);
studentRouter.get("/marksGraph", verifyTokenStudent, studentController.getStudentMarksGraph);

export default studentRouter;