import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Student from './Student.js';

export interface IEvalMetrics {
  evalMetricsId: bigint;
  problemSolving: number;
  codeQuality: number;
  debugging: number;
  rollNumber: string;
  count: number;
}

class EvalMetrics extends Model<IEvalMetrics> implements IEvalMetrics {
  public evalMetricsId!: bigint;
  public problemSolving!: number;
  public codeQuality!: number;
  public debugging!: number;
  public rollNumber!: string;
  public count!: number;
}

EvalMetrics.init(
  {
    evalMetricsId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    problemSolving: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    codeQuality: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    debugging: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'EvalMetrics',
    tableName: 'evalMetrics',
  }
);

export default EvalMetrics;
