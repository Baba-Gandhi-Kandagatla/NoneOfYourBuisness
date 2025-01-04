import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import College from './College.js';
import bcrypt from 'bcrypt';

export interface IAdmin {
    teacherId: string;
    name: string;
    password: string;
    collegeId: bigint;
    preferences: IAdminPreferences;
}

export interface IAdminPreferences {
  totalQuestions:Number;
  noOfCodingQuestions:Number;
  defaultPassword: string;
}

class Admin extends Model<IAdmin> implements IAdmin {
  public teacherId!: string;
  public name!: string;
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
    name: {
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
          admin.password = await bcrypt.hash(admin.password, 10);
        }
        if(Number(admin.preferences.noOfCodingQuestions) + Number(admin.preferences.totalQuestions) > 20){
          throw new Error('Total Questions should be less than 20');
        }
      },
      async beforeUpdate(admin: Admin) {
        if (admin.password && admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
        if(Number(admin.preferences.noOfCodingQuestions) + Number(admin.preferences.totalQuestions) > 20){
          throw new Error('Total Questions should be less than 20');
        }
      },
    },
  }
);
Admin.belongsTo(College, { foreignKey: 'college_id' });


export default Admin;
