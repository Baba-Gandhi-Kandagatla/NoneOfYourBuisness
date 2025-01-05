import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Student from './Student.js';
import Interview from './Interview.js';

export interface IFeedback {
  feedbackId: bigint;
  rollNumber: string;
  interviewId: bigint;
  feedbackText: string;
}

class Feedback extends Model<IFeedback> implements IFeedback {
  public feedbackId!: bigint;
  public rollNumber!: string;
  public interviewId!: bigint;
  public feedbackText!: string;
}

Feedback.init(
  {
    feedbackId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    rollNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: Student,
        key: 'rollNumber',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    interviewId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Interview,
        key: 'interviewId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    feedbackText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedback',
  }
);

export default Feedback;
