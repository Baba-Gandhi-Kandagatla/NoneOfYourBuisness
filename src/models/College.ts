import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

export interface ICollege {
  collegeId: bigint;
  collegeName: string;
  defaultStudentPassword: string;
}

class College extends Model<ICollege> implements ICollege {
  public collegeId!: bigint;
  public collegeName!: string;
  public defaultStudentPassword!: string;
}

College.init(
  {
    collegeId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    collegeName: {
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
    hooks: {
      beforeCreate: async (college:College) => {
        if(college.collegeName){
          college.collegeName = college.collegeName.toUpperCase();
        }
      },
      beforeUpdate: async (college:College) => {
        if(college.collegeName && college.changed('collegeName')){
          college.collegeName = college.collegeName.toUpperCase();
        }
      },
    },

  }
);

export default College;
