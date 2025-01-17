import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Student from './Student.js';

export interface IEvalMetrics {
  evalMetricsId: bigint;
  rollNumber: string;
  count: number;
  problemSolving: number;
  codeQuality: number;
  debugging: number;
  testing: number;
}

class EvalMetrics extends Model<IEvalMetrics> implements IEvalMetrics {
  public evalMetricsId!: bigint;
  public rollNumber!: string;
  public count!: number;
  public problemSolving!: number;
  public codeQuality!: number;
  public debugging!: number;
  public testing!: number;
}

EvalMetrics.init(
  {
    evalMetricsId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Student,
        key: 'rollNumber',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    problemSolving: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    codeQuality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    debugging: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    testing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'EvalMetrics',
    tableName: 'evalMetrics',
  }
);

export default EvalMetrics;
