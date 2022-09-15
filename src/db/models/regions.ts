import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { countries, countriesId } from './countries';

export interface regionsAttributes {
  id: number;
  uuid?: string;
  name?: string;
  display_name?: string;
  boundary?: object;
  created_at: Date;
  updated_at: Date;
}

export type regionsPk = "id";
export type regionsId = regions[regionsPk];
export type regionsOptionalAttributes = "id" | "uuid" | "name" | "display_name" | "boundary";
export type regionsCreationAttributes = Optional<regionsAttributes, regionsOptionalAttributes>;

export class regions extends Model<regionsAttributes, regionsCreationAttributes> implements regionsAttributes {
  id!: number;
  uuid?: string;
  name?: string;
  display_name?: string;
  boundary?: object;
  created_at!: Date;
  updated_at!: Date;

  // regions hasMany countries via region_id
  countries!: countries[];
  getCountries!: Sequelize.HasManyGetAssociationsMixin<countries>;
  setCountries!: Sequelize.HasManySetAssociationsMixin<countries, countriesId>;
  addCountry!: Sequelize.HasManyAddAssociationMixin<countries, countriesId>;
  addCountries!: Sequelize.HasManyAddAssociationsMixin<countries, countriesId>;
  createCountry!: Sequelize.HasManyCreateAssociationMixin<countries>;
  removeCountry!: Sequelize.HasManyRemoveAssociationMixin<countries, countriesId>;
  removeCountries!: Sequelize.HasManyRemoveAssociationsMixin<countries, countriesId>;
  hasCountry!: Sequelize.HasManyHasAssociationMixin<countries, countriesId>;
  hasCountries!: Sequelize.HasManyHasAssociationsMixin<countries, countriesId>;
  countCountries!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof regions {
    return regions.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    boundary: {
      type: DataTypes.JSON,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'regions',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "regions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
