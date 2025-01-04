import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Interview from './Interview.js';
import Department from './Department.js';


export interface IInterviewToDepartment {
  interviewToDepartmentId: bigint;
  interviewId: bigint;
  departmentId: bigint;
}

class InterviewToDepartment extends Model<IInterviewToDepartment> implements IInterviewToDepartment {
  public interviewToDepartmentId!: bigint;
  public interviewId!: bigint;
  public departmentId!: bigint;
}

InterviewToDepartment.init(
  {
    interviewToDepartmentId: {
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
    departmentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Department,
        key: 'departmentId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'InterviewToDepartment',
    tableName: 'interviewToDepartments',
  }
);

export default InterviewToDepartment;
