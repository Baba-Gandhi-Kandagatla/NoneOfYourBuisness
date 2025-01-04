import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Admin from './Admin.js';
import Student from './student.js';

export interface IAdminAuditLog {
  logId: bigint;
  teacherId: string;
  ipaddress: string;
  event: string;
}

class AdminAuditLog extends Model<IAdminAuditLog> implements IAdminAuditLog {
  public logId!: bigint;
  public teacherId!: string;
  public ipaddress!: string;
  public event!: string;
}

AdminAuditLog.init(
  {
    logId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    teacherId: {
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
  },
  {
    sequelize,
    modelName: 'StudentAuditLog',
    tableName: 'studentAuditLogs',
  }
);



AdminAuditLog.belongsTo(Admin, { foreignKey: 'teacherId' });

export default AdminAuditLog;