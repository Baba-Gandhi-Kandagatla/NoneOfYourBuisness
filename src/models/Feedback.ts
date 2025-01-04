import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

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
    },
    interviewId: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
