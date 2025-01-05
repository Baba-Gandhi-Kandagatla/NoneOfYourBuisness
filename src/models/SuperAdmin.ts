import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import bcrypt from 'bcrypt';
export interface ISuperAdmin {
  superAdminId: bigint;
  superAdminName: string;
  password: string;
}

class SuperAdmin extends Model<ISuperAdmin> implements ISuperAdmin {
  public superAdminId!: bigint;
  public superAdminName!: string;
  public password!: string;
}

SuperAdmin.init(
  {
    
    superAdminId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    superAdminName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  },
  {
    sequelize,
    modelName: 'SuperAdmin',
    tableName: 'superAdmin',
    hooks: {
      beforeCreate: async (user: SuperAdmin) => {
        if(user.dataValues.password){
          user.dataValues.password = bcrypt.hashSync(user.dataValues.password, parseInt(process.env.SALT_ROUNDS) || 10);
        }
        if(user.dataValues.superAdminName){
          user.dataValues.superAdminName = user.dataValues.superAdminName.toUpperCase();
        }
      },
      beforeUpdate:async (user: SuperAdmin) => {
        if(user.dataValues.password && user.changed('password')){
          user.dataValues.password = bcrypt.hashSync(user.dataValues.password, process.env.SALT_ROUNDS || 10);
        }
        if(user.dataValues.superAdminName && user.changed('superAdminName')){
          user.dataValues.superAdminName = user.dataValues.superAdminName.toUpperCase();
        }
      },
      afterSync: async () => {
        const count = await SuperAdmin.count();
        if (count === 0 && process.env.SUPERADMIN_NAME && process.env.SUPERADMIN_PASSWORD) {
          await SuperAdmin.create({
            superAdminName: process.env.SUPERADMIN_NAME ,
            password:bcrypt.hashSync(process.env.SUPERADMIN_PASSWORD, parseInt(process.env.SALT_ROUNDS) || 10),
          });
        }
      },
    },
  }
);

export default SuperAdmin;
