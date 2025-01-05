import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Admin from './Admin.js';

export interface IAdminAuditLog {
  logId: bigint;
  adminId: string;
  ipaddress: string;
  event: string;
}

class AdminAuditLog extends Model<IAdminAuditLog> implements IAdminAuditLog {
  public logId!: bigint;
  public adminId!: string;
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
    adminId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Admin,
        key: 'adminId',
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
    modelName: 'AtudentAuditLog',
    tableName: 'atudentAuditLogs',
  }
);
export default AdminAuditLog;
