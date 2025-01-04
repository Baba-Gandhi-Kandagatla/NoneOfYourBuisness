import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import Interview from "../models/Interview.js";
import Student from "../models/student.js";
import multer  from "multer";
import mammoth from "mammoth";
import { promises as fsPromises } from 'fs';
import InterviewToDepartment from "../models/InterviewToDepartments.js";
import Resume from "../models/Resume.js";
import path from "path";
import EvalMetrics from "../models/EvalMetrics.js";
import Department from "../models/Department.js";
import College from "../models/College.js";
// import { simpleTextGen } from "../Api-helper/helper.js";
import InterviewInstance from "../models/InterviewInstances.js";
import InterviewExchange from "../models/InterviewExchanges.js";
import Feedback from "../models/Feedback.js";


async function getStudentByRollNumber(rollNumber: string) 
{
    try {
      const student = await Student.findOne({ where: { rollNumber: rollNumber }, raw: true });
      if (!student) {
        throw new Error("User not found.");
      }
      return student;
    } catch (error) {
      throw new Error(`Error fetching student: ${error.message}`);
    }
}

export const getAllInterviews = async (req: Request, res: Response) => {
    try{
      const rollNumber = res.locals.jwtData.rollnumber;
      const user = await getStudentByRollNumber(rollNumber);
  
      const interviews = await Interview.findAll({
          include: [{
            model: InterviewToDepartment,
            where: {
                departmentId: user.departmentId, 
            },
            required: true, 
          }],
          where: {
            collageId: user.collegeId, 
          },
        });
      res.status(200).json({ interviews });
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
}
export const getSpecificInterviews = async (req: Request, res: Response) => {
    try{
        const rollNumber = res.locals.jwtData.rollnumber;
        const user = await getStudentByRollNumber(rollNumber);
        const {status} = req.params;
    
        const interviews = await Interview.findAll({
            include: [{
              model: InterviewToDepartment,
              where: {
                departmentId: user.departmentId, 
              },
              required: true, 
            }],
            where: {
              collageId: user.collegeId,
              status: status,
            },
          });
        res.status(200).json({ interviews });
      }
      catch(error){
        res.status(500).json({ message: error.message });
      }
};

export const get_resume = async (req: Request, res: Response) => {
    try {
      const { rollnumber } = res.locals.jwtData;
  
      const resume = (await Resume.findOne({ where: { rollNumber: rollnumber } })).get();
      const resume_context = resume.resumeContext;
      if (!resume || !resume.resumeLocation) {
        return res.status(404).json({ message: "Resume not found" });
      }
  
      const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1, -1);
      const resumeFilePath = path.resolve(__dirname, '../..', resume.resumeLocation);

      try {
        const data = await fsPromises.readFile(resumeFilePath);
        const resume64 = data.toString('base64');
        res.json({ resume: resume64, resume_context: resume_context });
      } catch (error) {
        res.status(500).json({ message: "Error reading resume file." });
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };