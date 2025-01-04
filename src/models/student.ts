import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Department from './Department.js';
import College from './College.js';
import bcrypt from 'bcrypt';

export interface IStudent {
  roll_number: string;
  username: string;
  year: number;
  semester: 1 | 2;
  department_id: bigint;
  section: String;
  password: string;
  college_id: bigint;
  attendance: number;
}

class Student extends Model<IStudent> implements IStudent {
  public roll_number!: string;
  public username!: string;
  public year!: number;
  public semester!: 1 | 2;
  public department_id!: bigint;
  public section!: String;
  public password!: string;
  public college_id!: bigint;
  public attendance!: number;
}

Student.init(
  {
    roll_number: {
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
    department_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    college_id: {
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
          student.password = await bcrypt.hash(student.password, 10);
        }
      },
      async beforeUpdate(student: Student) {
        if (student.password && student.changed('password')) {
          student.password = await bcrypt.hash(student.password, 10);
        }
      }
    }
  }
);

Student.belongsTo(Department, { foreignKey: 'department_id' });
Student.belongsTo(College, { foreignKey: 'college_id' });

export default Student;
