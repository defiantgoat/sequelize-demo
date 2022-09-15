import Joi from "joi";
import { TABLE_NAMES } from "./constants";

export default {
  [TABLE_NAMES.Countries]: Joi.object({
    name: Joi.string(),
    iso_a3: Joi.string()
      .replace(/(NULL)/, "")
      .max(3)
      .allow(null, ""),
    iso_a2: Joi.string()
      .replace(/(NULL)/, "")
      .max(2)
      .allow(null, ""),
    region_name: Joi.string().max(50).allow(null, ""),
    uuid: Joi.string().allow(null, ""),
  }),
  [TABLE_NAMES.Regions]: Joi.object({
    name: Joi.string(),
    boundary: Joi.object(),
    uuid: Joi.string().allow(null, ""),
  }),
};
