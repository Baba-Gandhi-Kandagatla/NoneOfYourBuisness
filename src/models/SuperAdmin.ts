import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import bcrypt from 'bcrypt';
export interface ISuperAdmin {
  superAdminId: bigint;
  username: string;
  password: string;
}

class SuperAdmin extends Model<ISuperAdmin> implements ISuperAdmin {
  public superAdminId!: bigint;
  public username!: string;
  public password!: string;
}

SuperAdmin.init(
  {
    
    superAdminId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
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
    modelName: 'God',
    tableName: 'god',
    hooks: {
      beforeCreate: (user: SuperAdmin) => {
        if(user.password){
          user.password = bcrypt.hashSync(user.password, process.env.SALT_ROUNDS || 10);
        }
      },
      beforeUpdate: (user: SuperAdmin) => {
        if(user.password && user.changed('password')){
          user.password = bcrypt.hashSync(user.password, process.env.SALT_ROUNDS || 10);
        }
      },
    },
  }
);

export default SuperAdmin;
