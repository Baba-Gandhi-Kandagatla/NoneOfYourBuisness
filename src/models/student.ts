import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import bcrypt from 'bcrypt';
import Resume from './Resume.js';
import InterviewExchange from './InterviewExchanges.js';
import Interview from './Interview.js';
import InterviewToDepartment from './InterviewToDepartments.js';
import InterviewInstance from './InterviewInstances.js';

export interface IStudent {
  rollNumber: string;
  studentname: string;
  batchId: bigint;
  departmentId: bigint;
  password: string;
  collegeId: bigint;
  attendance: number;
}

class Student extends Model<IStudent> implements IStudent {
  public rollNumber!: string;
  public studentname!: string;
  public batchId: bigint;
  public departmentId!: bigint;
  public password!: string;
  public collegeId!: bigint;
  public attendance!: number;
}

Student.init(
  {
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    studentname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    attendance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'student',
    hooks:{
      async beforeCreate(student: Student) {
        if (student.password) {
          student.password = await bcrypt.hashSync(student.password, process.env.SALT_ROUNDS || 10);
        }
      },
      async beforeUpdate(student: Student) {
        if (student.password && student.changed('password')) {
          student.password = await bcrypt.hashSync(student.password, process.env.SALT_ROUNDS || 10);
        }
      }
    }
  }
);

export default Student;
