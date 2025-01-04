import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import InterviewInstance from './InterviewInstances.js';

export interface IInterviewExchange {
  InterviewExchangeId: bigint;
  interviewInstanceId: bigint;
  question: string;
  reframedQuestion: string;
  code: string;
  response: string;
  marks: number;
  feedback: string;
}

class InterviewExchange extends Model<IInterviewExchange> implements IInterviewExchange {
  public InterviewExchangeId!: bigint;
  public interviewInstanceId!: bigint;
  public question!: string;
  public reframedQuestion!: string;
  public code!: string;
  public response!: string;
  public marks!: number;
  public feedback!: string;
}

InterviewExchange.init(
  {
    InterviewExchangeId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    interviewInstanceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: InterviewInstance,
        key: 'interviewInstanceId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reframedQuestion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'InterviewExchange',
    tableName: 'interviewExchanges',
  }
);


export default InterviewExchange;