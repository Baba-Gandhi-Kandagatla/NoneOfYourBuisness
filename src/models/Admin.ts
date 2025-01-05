import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import College from './College.js';
import bcrypt from 'bcrypt';

export interface IAdmin {
    adminId: string;
    adminName: string;
    password: string;
    collegeId: bigint;
    preferences: IAdminPreferences;
}

export interface IAdminPreferences {
  noOfQuestions:Number;
  noOfCodingQuestions:Number;
}

class Admin extends Model<IAdmin> implements IAdmin {
  public adminId!: string;
  public adminName!: string;
  public password!: string;
  public collegeId!: bigint;
  public preferences!: IAdminPreferences;
}

Admin.init(
  {
    adminId: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLongEnough(value: string) {
          if (value.length < 8) {
            throw new Error("Password should contain at least 8 characters");
          }
        },
        hasUpperCase(value: string) {
          if (!/[A-Z]/.test(value)) {
            throw new Error("Password should contain at least one uppercase letter");
          }
        },
        hasLowerCase(value: string) {
          if (!/[a-z]/.test(value)) {
            throw new Error("Password should contain at least one lowercase letter");
          }
        },
        hasNumber(value: string) {
          if (!/[0-9]/.test(value)) {
            throw new Error("Password should contain at least one number");
          }
        },
        hasSpecialChar(value: string) {
          if (!/[\W_]/.test(value)) {
            throw new Error("Password should contain at least one special character");
          }
        },
      },
    },
    adminName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: College,
          key: 'collegeId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        noOfQuestions: 10,
        noOfCodingQuestions: 5,
      },
      validate: {
        checkTotalQuestions(value: IAdminPreferences) {
          if (Number(value.noOfCodingQuestions) + Number(value.noOfQuestions) > 20) {
            throw new Error('Total Questions should be less than 20');
          }
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admin',
    hooks: {
      async beforeCreate(admin: Admin) {
        if (admin.dataValues.password) {
          admin.dataValues.password = bcrypt.hashSync(admin.dataValues.password,  parseInt(process.env.SALT_ROUNDS) || 10);
        }
        if(admin.dataValues.adminId){
          admin.dataValues.adminId = admin.dataValues.adminId.toUpperCase(); 
        }
        if(admin.dataValues.adminName){
          admin.dataValues.adminName = admin.dataValues.adminName.toUpperCase();
        }
      },
      async beforeUpdate(admin: Admin) {
        if (admin.dataValues.password && admin.changed('password')) {
          admin.dataValues.password = await bcrypt.hashSync(admin.dataValues.password,  parseInt(process.env.SALT_ROUNDS )|| 10);
        }
        if(admin.dataValues.adminId){
          admin.dataValues.adminId = admin.dataValues.adminId.toUpperCase(); 
        }
        if(admin.dataValues.adminName){
          admin.dataValues.adminName = admin.dataValues.adminName.toUpperCase();
        }
      },
    },
  }
);


export default Admin;
