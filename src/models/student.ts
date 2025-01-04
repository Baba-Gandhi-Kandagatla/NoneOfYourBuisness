import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import bcrypt from 'bcrypt';
import Batch from './Batch.js';
import Department from './Department.js';
import College from './College.js';

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
      references: {
        model: Batch,
        key: 'batchId',
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: College,
        key: 'collegeId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
        if(student.studentname){
          student.studentname = student.studentname.toUpperCase();
        }
        if(student.rollNumber){
          student.rollNumber = student.rollNumber.toUpperCase();
        }
      },
      async beforeUpdate(student: Student) {
        if (student.password && student.changed('password')) {
          student.password = await bcrypt.hashSync(student.password, process.env.SALT_ROUNDS || 10);
        }
        if(student.studentname && student.changed('studentname')){
          student.studentname = student.studentname.toUpperCase();
        }
        if(student.rollNumber && student.changed('rollNumber')){
          student.rollNumber = student.rollNumber.toUpperCase();
        }
      }
    }
  }
);

export default Student;
