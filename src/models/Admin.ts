import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import College from './College.js';
import bcrypt from 'bcrypt';
import AdminAuditLog from './AdminAuditLogs.js';

export interface IAdmin {
    teacherId: string;
    adminName: string;
    password: string;
    collegeId: bigint;
    preferences: IAdminPreferences;
}

export interface IAdminPreferences {
  totalQuestions:Number;
  noOfCodingQuestions:Number;
}

class Admin extends Model<IAdmin> implements IAdmin {
  public teacherId!: string;
  public adminName!: string;
  public password!: string;
  public collegeId!: bigint;
  public preferences!: IAdminPreferences;
}

Admin.init(
  {
    teacherId: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admin',
    hooks: {
      async beforeCreate(admin: Admin) {
        if (admin.password) {
          admin.password = await bcrypt.hashSync(admin.password, 10);
        }
        if(Number(admin.preferences.noOfCodingQuestions) + Number(admin.preferences.totalQuestions) > 20){
          throw new Error('Total Questions should be less than 20');
        }
      },
      async beforeUpdate(admin: Admin) {
        if (admin.password && admin.changed('password')) {
          admin.password = await bcrypt.hashSync(admin.password, 10);
        }
        if(Number(admin.preferences.noOfCodingQuestions) + Number(admin.preferences.totalQuestions) > 20){
          throw new Error('Total Questions should be less than 20');
        }
      },
    },
  }
);


export default Admin;
