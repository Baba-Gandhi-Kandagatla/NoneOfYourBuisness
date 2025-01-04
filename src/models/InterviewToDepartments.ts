import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

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
    },
    departmentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'InterviewToDepartment',
    tableName: 'interviewToDepartments',
  }
);


export default InterviewToDepartment;
