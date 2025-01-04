import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Student from './student.js';

export interface IResume {
  resumeId: bigint;
  rollNumber: string;
  resumeLocation: string;
  resumeContext: string;
}

class Resume extends Model<IResume> implements IResume {
  public resumeId!: bigint;
  public rollNumber!: string;
  public resumeLocation!: string;
  public resumeContext!: string;
}

Resume.init(
  {
    resumeId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resumeLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resumeContext: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
  },
  {
    sequelize,
    modelName: 'Resume',
    tableName: 'resume',
  }
);


export default Resume;
