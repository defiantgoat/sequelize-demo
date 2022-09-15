import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { regions, regionsId } from './regions';

export interface countriesAttributes {
  id: number;
  uuid?: string;
  name?: string;
  iso_a2?: string;
  iso_a3?: string;
  region_id?: number;
  region_name?: string;
  created_at: Date;
  updated_at: Date;
}

export type countriesPk = "id";
export type countriesId = countries[countriesPk];
export type countriesOptionalAttributes = "id" | "uuid" | "name" | "iso_a2" | "iso_a3" | "region_id" | "region_name";
export type countriesCreationAttributes = Optional<countriesAttributes, countriesOptionalAttributes>;

export class countries extends Model<countriesAttributes, countriesCreationAttributes> implements countriesAttributes {
  id!: number;
  uuid?: string;
  name?: string;
  iso_a2?: string;
  iso_a3?: string;
  region_id?: number;
  region_name?: string;
  created_at!: Date;
  updated_at!: Date;

  // countries belongsTo regions via region_id
  region!: regions;
  getRegion!: Sequelize.BelongsToGetAssociationMixin<regions>;
  setRegion!: Sequelize.BelongsToSetAssociationMixin<regions, regionsId>;
  createRegion!: Sequelize.BelongsToCreateAssociationMixin<regions>;

  static initModel(sequelize: Sequelize.Sequelize): typeof countries {
    return countries.init({
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
    iso_a2: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    iso_a3: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'regions',
        key: 'id'
      }
    },
    region_name: {
      type: DataTypes.STRING(50),
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
    tableName: 'countries',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "countries_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
