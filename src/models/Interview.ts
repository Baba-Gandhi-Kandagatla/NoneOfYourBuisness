import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import InterviewExchange from './InterviewExchanges.js';
import InterviewToDepartment from './InterviewToDepartments.js';
import Department from './Department.js';

export interface IInterview {
  interviewId: bigint;
  interviewName: string;
  collageId: bigint;
  subject: string;
  topic: string;
  noOfQuestions: number;
  noOfCodingQuestions: number;
  status: 'scheduled' | 'paused' | 'active';
}

class Interview extends Model<IInterview> implements IInterview {
  public interviewId!: bigint;
  public interviewName!: string;
  public collageId!: bigint;
  public subject!: string;
  public topic!: string;
  public noOfQuestions!: number;
  public noOfCodingQuestions: number;
  public status!: 'scheduled' | 'paused' | 'active';
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
      type: DataTypes.ENUM('scheduled', 'paused', 'active'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
  },
  {
    sequelize,
    modelName: 'Interview',
    tableName: 'interview',
  }
);

Interview.hasMany(InterviewExchange, { foreignKey: 'interview_id' });
Interview.hasMany(InterviewToDepartment, { foreignKey: 'interview_id' });

Interview.belongsToMany(Department, {
  through: InterviewToDepartment,
  foreignKey: 'interview_id',
  otherKey: 'department_id',
  as: 'departments'
});

Department.belongsToMany(Interview, {
  through: InterviewToDepartment,
  foreignKey: 'department_id',
  otherKey: 'interview_id'
});

export default Interview;

