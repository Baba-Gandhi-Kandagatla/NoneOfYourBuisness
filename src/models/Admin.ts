import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import College from './College.js';
import bcrypt from 'bcrypt';

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
        if(Number(admin.dataValues.preferences.noOfCodingQuestions) + Number(admin.dataValues.preferences.totalQuestions) > 20){
          throw new Error('Total Questions should be less than 20');
        }
        if(admin.dataValues.teacherId){
          admin.dataValues.teacherId = admin.dataValues.teacherId.toUpperCase(); 
        }
        if(admin.dataValues.adminName){
          admin.dataValues.adminName = admin.dataValues.adminName.toUpperCase();
        }
      },
      async beforeUpdate(admin: Admin) {
        if (admin.dataValues.password && admin.changed('password')) {
          admin.dataValues.password = await bcrypt.hashSync(admin.dataValues.password,  parseInt(process.env.SALT_ROUNDS )|| 10);
        }
        if(Number(admin.dataValues.preferences.noOfCodingQuestions) + Number(admin.dataValues.preferences.totalQuestions) > 20){
          throw new Error('Total Questions should be less than 20');
        }
        if(admin.dataValues.teacherId){
          admin.dataValues.teacherId = admin.dataValues.teacherId.toUpperCase(); 
        }
        if(admin.dataValues.adminName){
          admin.dataValues.adminName = admin.dataValues.adminName.toUpperCase();
        }
      },
    },
  }
);


export default Admin;
