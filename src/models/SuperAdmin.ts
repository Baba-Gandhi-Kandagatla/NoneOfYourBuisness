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
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SuperAdmin',
    tableName: 'superAdmin',
    hooks: {
      beforeCreate: (user: SuperAdmin) => {
        if(user.password){
          user.password = bcrypt.hashSync(user.password, process.env.SALT_ROUNDS || 10);
        }
        if(user.superAdminName){
          user.superAdminName = user.superAdminName.toUpperCase();
        }

      },
      beforeUpdate: (user: SuperAdmin) => {
        if(user.password && user.changed('password')){
          user.password = bcrypt.hashSync(user.password, process.env.SALT_ROUNDS || 10);
        }
        if(user.superAdminName && user.changed('superAdminName')){
          user.superAdminName = user.superAdminName.toUpperCase();
        }
      },
    },
  }
);

export default SuperAdmin;
