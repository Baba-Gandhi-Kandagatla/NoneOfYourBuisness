import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Department from './Department.js';
import College from './College.js';
import bcrypt from 'bcrypt';
import Resume from './Resume.js';
import InterviewExchange from './InterviewExchanges.js';
import Interview from './Interview.js';
import InterviewToDepartment from './InterviewToDepartments.js';
import InterviewInstance from './InterviewInstances.js';

export interface IStudent {
  rollNumber: string;
  username: string;
  year: number;
  semester: 1 | 2;
  departmentId: bigint;
  password: string;
  collegeId: bigint;
  attendance: number;
}

class Student extends Model<IStudent> implements IStudent {
  public rollNumber!: string;
  public username!: string;
  public year!: number;
  public semester!: 1 | 2;
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM('1', '2'),
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
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'student',
    hooks:{
      async beforeCreate(student: Student) {
        if (student.password) {
          student.password = await bcrypt.hash(student.password, process.env.SALT_ROUNDS || 10);
        }
      },
      async beforeUpdate(student: Student) {
        if (student.password && student.changed('password')) {
          student.password = await bcrypt.hash(student.password, process.env.SALT_ROUNDS || 10);
        }
      }
    }
  }
);

Student.belongsTo(Department, { foreignKey: 'departmentId' });
Student.belongsTo(College, { foreignKey: 'collegeId' });
Student.hasMany(Resume, { foreignKey: 'rollNumber' });
Student.hasMany(InterviewInstance, { foreignKey: 'rollNumber' });

export default Student;
