import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import InterviewToDepartment from './InterviewToDepartments.js';
import Department from './Department.js';
import College from './College.js';
import Batch from './Batch.js';

export interface IInterview {
  interviewId: bigint;
  interviewName: string;
  collageId: bigint;
  batchId: bigint;
  subject: string;
  topic: string;
  noOfQuestions: number;
  noOfCodingQuestions: number;
  status: 'Scheduled' | 'Started' | 'Ended';
  startTime: Date;
  durationMin: number;
}

class Interview extends Model<IInterview> implements IInterview {
  public interviewId!: bigint;
  public interviewName!: string;
  public collageId!: bigint;
  public batchId!: bigint;
  public subject!: string;
  public topic!: string;
  public noOfQuestions!: number;
  public noOfCodingQuestions: number;
  public status!: 'Scheduled' | 'Started' | 'Ended';
  public startTime!: Date;
  public durationMin!: number;
}

Interview.init(
  {
    interviewId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    interviewName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    collageId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: College,
        key: 'collegeId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    batchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Batch,
        key: 'batchId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    noOfQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    noOfCodingQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    status: {
      type: DataTypes.ENUM('Scheduled', 'Started', 'Ended'),
      allowNull: false,
      defaultValue: 'Scheduled',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durationMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Interview',
    tableName: 'interview',
  }
);


export default Interview;

