import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import College from './College.js';

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
      references: {
        model: College,
        key: 'collegeId',
      },
    }
  },
  {
    sequelize,
    modelName: 'Department',
    tableName: 'department',
    hooks: {
      beforeCreate: async (department:Department) => {
        if(department.departmentName){
          department.departmentName = department.departmentName.toUpperCase();
        }
      },
      beforeUpdate: async (department:Department) => {
        if(department.departmentName && department.changed('departmentName')){
          department.departmentName = department.departmentName.toUpperCase();
        }
      },
    }
  }
);

export default Department;
