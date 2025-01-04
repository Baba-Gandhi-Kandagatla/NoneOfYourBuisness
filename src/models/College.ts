import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

export interface ICollege {
  collegeId: bigint;
  name: string;
  defaultStudentPassword: string;
}

class College extends Model<ICollege> implements ICollege {
  public collegeId!: bigint;
  public name!: string;
  public defaultStudentPassword!: string;
}

College.init(
  {
    collegeId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    defaultStudentPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'College',
    tableName: 'college',
  }
);

export default College;
