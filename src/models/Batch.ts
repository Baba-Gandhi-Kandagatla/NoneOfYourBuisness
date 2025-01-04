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
  }
);

export default Batch;