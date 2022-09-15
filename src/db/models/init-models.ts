import type { Sequelize } from "sequelize";
import { countries as _countries } from "./countries";
import type { countriesAttributes, countriesCreationAttributes } from "./countries";
import { regions as _regions } from "./regions";
import type { regionsAttributes, regionsCreationAttributes } from "./regions";

export {
  _countries as countries,
  _regions as regions,
};

export type {
  countriesAttributes,
  countriesCreationAttributes,
  regionsAttributes,
  regionsCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const countries = _countries.initModel(sequelize);
  const regions = _regions.initModel(sequelize);

  countries.belongsTo(regions, { foreignKey: "region_id"});
  regions.hasMany(countries, { foreignKey: "region_id"});

  return {
    countries: countries,
    regions: regions,
  };
}
