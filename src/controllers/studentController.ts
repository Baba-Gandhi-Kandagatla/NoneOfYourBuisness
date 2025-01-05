import { Request, Response } from "express";
import {  compare } from "bcrypt";
import Interview from "../models/Interview.js";
import Student from "../models/Student.js";
import multer  from "multer";
import mammoth from "mammoth";
import { promises as fsPromises } from 'fs';
import InterviewToDepartment from "../models/InterviewToDepartments.js";
import Resume from "../models/Resume.js";
import path from "path";
import InterviewInstance from "../models/InterviewInstances.js";
import InterviewExchange from "../models/InterviewExchanges.js";
import Feedback from "../models/Feedback.js";
import { generateResumeSummary } from "../apiHelper/helper.js";
import { clearAndSetCookie, createToken } from "../utils/token-manager.js";
import { handleError } from "../utils/util.js";


async function getStudentByRollNumber(rollNumber: string) 
{
    try {
      const student = await Student.findByPk(rollNumber, {raw: true});
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
    const student = await getStudentByRollNumber(rollNumber);

    const interviews = await Interview.findAll({
        include: [{
          model: InterviewToDepartment,
          where: {
            departmentId: student.departmentId, 
          },
          required: true, 
        },
        {
          model: InterviewInstance,
          where: {
            studentRollNumber: student.rollNumber,
          },
          attributes: ['status'],
          required: false,
        }
      ],
        where: {
          collageId: student.collegeId, 
          batchId: student.batchId,
        },
      });
    res.status(200).json({ interviews });
  }
  catch(error){
    handleError(error, res, "Error fetching interviews");
  }
}

export const getSpecificInterviews = async (req: Request, res: Response) => {
  try{
      const rollNumber = res.locals.jwtData.rollnumber;
      const student = await getStudentByRollNumber(rollNumber);
      const interviews = await Interview.findAll({
        include: [{
          model: InterviewToDepartment,
          where: {
            departmentId: student.departmentId,  
          },
          required: true, 
        },
        {
          model: InterviewInstance,
          where: {
            studentRollNumber: student.rollNumber,
            status: "submitted",
          },
          required: true,
        }
      ],
        where: {
          collageId: student.collegeId, 
          batchId: student.batchId,
        },
      });
      res.status(200).json({ interviews });
    }
    catch(error){
      handleError(error, res, "Error fetching interviews");
    }
  };

export const get_resume = async (req: Request, res: Response) => {
    try {
      const { rollnumber } = res.locals.jwtData;
  
      const resume = await Resume.findOne({ where: { rollNumber: rollnumber }, raw: true }) ;
      const resumeContext = resume.resumeContext;
      if (!resume || !resume.resumeLocation) {
        return res.status(404).json({ message: "Resume not found" });
      }
  
      const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1, -1);
      const resumeFilePath = path.resolve(__dirname, '../..', resume.resumeLocation);

      try {
        const data = await fsPromises.readFile(resumeFilePath);
        const resume64 = data.toString('base64');
        res.json({ resume: resume64, resume_context: resumeContext });
      } catch (error) {
        handleError(error, res, "Error reading resume file");
      }
    } catch (error) {
      handleError(error, res, "Error fetching resume");
    }
};


const upload = multer({ dest: 'uploads/' });
export const uploadResume = [
  upload.single("resume"),
  async (req: Request & { file: Express.Multer.File }, res: Response) => {
    const rollNumber = res.locals.jwtData.rollnumber;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    try {
      const newFilePath = req.file.path;

      const result = await mammoth.extractRawText({ path: newFilePath });
      const extractedText = result.value;
      const resumeContext = await generateResumeSummary(extractedText);

      const existingResume = await Resume.findOne({ where: { rollNumber: rollNumber }, raw: true });

      if (existingResume) {
        const oldFilePath = existingResume.resumeLocation;
        if (oldFilePath) {
          await fsPromises.unlink(oldFilePath).catch((err) => {
            handleError(err, res, "Error deleting old resume file");
          });
        }

        await existingResume.update({
          resumeLocation: newFilePath,
          resumeContext: resumeContext,
        });
      } else {
        await Resume.create({
          resumeLocation: newFilePath,
          resumeContext: resumeContext,
          rollNumber: rollNumber,
        });
      }

      res.status(200).json({ message: "Resume uploaded and saved successfully." });
    } catch (error) {
      console.error("Upload resume error:", error);

      if (req.file && req.file.path) {
        await fsPromises.unlink(req.file.path).catch((err) => {
          console.error("Error deleting uploaded resume file due to failure:", err);
        });
      }

      res.status(500).json({ message: "Internal server error." });
    }
  },
];



export const changePassword = async (req: Request, res: Response) => {
  const rollNumber = res.locals.jwtData.rollnumber;
  const { oldPassword, newPassword } = req.body;
  try {
    const student = await Student.findOne({ where: { rollNumber: rollNumber } });

    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await compare(oldPassword, student.get().password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password." });
    }

    await student.update({ password: newPassword });

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getInterwievResult = async (req: Request, res: Response) => {
  
  const rollNumber = res.locals.jwtData.rollnumber;
  const { id } = req.params;
  try {
    const student = await Student.findOne({ where: { rollNumber: rollNumber } });
    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }
    const interviewinstance = await InterviewInstance.findOne({ where: { studentRollNumber: student.get().rollNumber, interviewId: id } });
    if (!interviewinstance) {
      return res.status(404).json({ message: "Interview instance not found." });
    }
    const interviewExchanges = await InterviewExchange.findAll({ where: { interviewInstanceId: interviewinstance.get().interviewInstanceId } });
    if (!interviewExchanges) {
      return res.status(404).json({ message: "Interview exchanges not found." });
    }
    res.status(200).json({ interviewData:interviewinstance.get(), InterviewExchange: interviewExchanges.map((exchange) => exchange.get()) });
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  const rollNumber = res.locals.jwtData.rollnumber;
  const { interviewId, feedbackText } = req.body;
  try {
    const student = await Student.findOne({ where: { rollNumber: rollNumber } });
    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }
    const feedback = await Feedback.create({ rollNumber: student.get().rollNumber, interviewId: interviewId, feedbackText: feedbackText });
    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getFeedback = async (req: Request, res: Response) => {
  const rollNumber = res.locals.jwtData.rollnumber;
  try {
    const student = await Student.findOne({ where: { rollNumber: rollNumber } });
    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }    
    const feedback = await Feedback.findAll({ where: { rollNumber: student.get().rollNumber } });
    res.status(200).json({ feedback });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  const { rollNumber, password } = req.body;
  try {
    const student = await Student.findOne({ where: { rollNumber: rollNumber } });
    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }
    const isPasswordValid = await compare(password, student.get().password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }
    const token = createToken(
      student.get().rollNumber,
      'student',
      '1h'
    );

    clearAndSetCookie(res, token);

    const userInfo = {
      rollNumber: student.get().rollNumber,
      username: student.get().studentname,
      role: 'student'
    };

    res.status(200).json({ ...userInfo, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};



export const getStudentAttendance = async (req: Request, res: Response) => {
  const rollNumber = res.locals.jwtData.rollnumber;
  try {
    const user = await Student.findOne({ where: { rollNumber: rollNumber } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const interviews = await Interview.findAll({
      include: [{
        model: InterviewToDepartment,
        where: {
          department_id: user.departmentId, 
        },
        required: true, 
      },
    ],
      where: {
        collageId: user.collegeId, 
      },
    });
    const interviewInstances = await InterviewInstance.findAll({ where: { studentRollNumber: user.get().rollNumber } });
    const attendance = interviewInstances.length / interviews.length;
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};



export const getStudentMarksByInterview = async (req: Request, res: Response) => {
  const rollNumber = res.locals.jwtData.rollnumber;
  try {
    const user = await Student.findOne({ where: { rollNumber: rollNumber } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const interviewInstancesMarks = await InterviewInstance.findAll({ where: { studentRollNumber: user.get().rollNumber } , attributes: ['marks']});
    res.status(200).json(interviewInstancesMarks);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};