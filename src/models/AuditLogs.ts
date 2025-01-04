import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Admin from './Admin.js';
import Student from './Student.js';

export interface IAuditLog {
  logId: bigint;
  rollNumber: string;
  ipaddress: string;
  event: string;
  userType: string;
  time: Date;
}

class AuditLog extends Model<IAuditLog> implements IAuditLog {
  public logId!: bigint;
  public rollNumber!: string;
  public ipaddress!: string;
  public event!: string;
  public userType!: string;
  public time!: Date;
}

AuditLog.init(
  {
    logId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ipaddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'auditLogs',
  }
);


AuditLog.belongsTo(Student, { foreignKey: 'roll_number' });
AuditLog.belongsTo(Admin, { foreignKey: 'roll_number' });

export default AuditLog;
