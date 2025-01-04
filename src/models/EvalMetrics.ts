import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

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
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    testing: {
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
