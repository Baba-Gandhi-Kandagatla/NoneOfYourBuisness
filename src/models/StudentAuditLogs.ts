import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Student from './student.js';

export interface IStudentAuditLog {
  logId: bigint;
  rollNumber: string;
  ipaddress: string;
  event: string;
}

class StudentAuditLog extends Model<IStudentAuditLog> implements IStudentAuditLog {
  public logId!: bigint;
  public rollNumber!: string;
  public ipaddress!: string;
  public event!: string;
}

StudentAuditLog.init(
  {
    logId: {
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
    ipaddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'StudentAuditLog',
    tableName: 'studentAuditLogs',
  }
);

export default StudentAuditLog;
