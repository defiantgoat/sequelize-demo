import CountriesController from "./countries_controller";
import RegionsController from "./regions_controller";
import { TABLE_NAMES } from "../constants";

export default {
  [TABLE_NAMES.Countries]: CountriesController,
  [TABLE_NAMES.Regions]: RegionsController,
};
