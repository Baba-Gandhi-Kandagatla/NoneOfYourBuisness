import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Student from './Student.js';
import Interview from './Interview.js';
export interface IFeedBack{
  strengths: string[],
  weaknesses: string[],
  summary: string,
}
export interface IInterviewInstance {
  interviewInstanceId: bigint;
  interviewId: bigint;
  studentRollNumber: string;
  studentIp: string;
  voiolationCount: number;
  marks: number;
  feedback: IFeedBack;
  status: "submitted"|"not submitted";
  timeTaken: number;
}

class InterviewInstance extends Model<IInterviewInstance> implements IInterviewInstance {
  public interviewInstanceId!: bigint;
  public interviewId!: bigint;
  public studentRollNumber!: string;
  public studentIp!: string;
  public voiolationCount!: number;
  public marks!: number;
  public feedback!: IFeedBack;
  public status!: "submitted"|"not submitted";
  public timeTaken!: number;
}

InterviewInstance.init(
  {
    interviewInstanceId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    interviewId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Interview,
        key: 'interviewId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    studentRollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Student,
        key: 'rollNumber',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    studentIp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    voiolationCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    feedback: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
      validate: {
        isValidFeedback(value: any) {
          if (value) {
            if (!Array.isArray(value.strengths) || !Array.isArray(value.weaknesses)) {
              throw new Error('Strengths and weaknesses must be arrays of strings');
            }
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM('submitted', 'not submitted'),
      allowNull: false,
      defaultValue: 'not submitted',
    },
    timeTaken: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'InterviewInstance',
    tableName: 'interviewInstances',
  }
);


export default InterviewInstance;