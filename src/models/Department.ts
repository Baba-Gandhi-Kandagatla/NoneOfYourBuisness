import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

export interface IDepartment {
  departmentId: bigint;
  departmentName: string;
  collegeId: bigint;
}

class Department extends Model<IDepartment> implements IDepartment {
  public departmentId!: bigint;
  public departmentName!: string;
  public collegeId!: bigint;
}

Department.init(
  {
    departmentId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Department',
    tableName: 'department',
  }
);

export default Department;
