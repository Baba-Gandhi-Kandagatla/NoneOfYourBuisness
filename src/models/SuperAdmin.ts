import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

export interface ISuperAdmin {
  godId: bigint;
  username: string;
  password: string;
}

class SuperAdmin extends Model<ISuperAdmin> implements ISuperAdmin {
  public godId!: bigint;
  public username!: string;
  public password!: string;
}

SuperAdmin.init(
  {
    
    godId: {
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
    modelName: 'SuperAdmin',
    tableName: 'superAdmin',
  }
);

export default SuperAdmin;
