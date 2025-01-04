import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import College from './College.js';

export interface IBatch {
  batchId: bigint;
  batchName: string;
  collegeId: bigint;
}

class Batch extends Model<IBatch> implements IBatch {
  public batchId!: bigint;
  public batchName!: string;
  public collegeId!: bigint;
}

Batch.init(
  {
    batchId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    batchName: {
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
    }
  },
  {
    sequelize,
    modelName: 'Batch',
    tableName: 'batch',
    hooks: {
      beforeCreate: async (batch: Batch) => {
        if(batch.dataValues.batchName){
          batch.dataValues.batchName = batch.dataValues.batchName.toUpperCase();
        }
      },
      beforeUpdate: async (batch: Batch) => {
        if(batch.dataValues.batchName && batch.changed('batchName')){
          batch.dataValues.batchName = batch.dataValues.batchName.toUpperCase();
        }
      },
    }
  }
);

export default Batch;