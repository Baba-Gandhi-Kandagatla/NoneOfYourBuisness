import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Student from './Student.js';

export interface IResume {
  resumeId: bigint;
  resumeLocation: string;
  resumeContext: string;
  rollNumber: string;
}

class Resume extends Model<IResume> implements IResume {
  public resumeId!: bigint;
  public resumeLocation!: string;
  public resumeContext!: string;
  public rollNumber!: string;
}

Resume.init(
  {
    resumeId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
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
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Resume',
    tableName: 'resume',
  }
);

Resume.belongsTo(Student, { foreignKey: 'roll_number' });

export default Resume;
