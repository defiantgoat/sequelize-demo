"use strict";
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const path = require("path");
const dayjs = require("dayjs");
const { v4 } = require("uuid");
const Joi = require("joi");

const countriesSchema = Joi.object({
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
});

module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingRecords] = await queryInterface.sequelize.query(
      "SELECT id from countries"
    );
    if (existingRecords.length > 0) {
      // records exist, do not re-seed
      console.log("Records exist. Not re-seeding");
      return;
    }

    const [regions] = await queryInterface.sequelize.query(
      "SELECT id, name from regions"
    );
    const data = fs.readFileSync(
      path.resolve(__dirname, "../data/countries.csv")
    );
    const records = parse(data, { columns: true, bom: true });
    const validatedRecords = [];
    for (const record of records) {
      const { error, value: validatedRecord } =
        countriesSchema.validate(record);
      if (validatedRecord) {
        const { region_name } = validatedRecord;
        const { id } = regions.find(({ name }) => name === region_name);
        validatedRecord["created_at"] = dayjs().toISOString();
        validatedRecord["updated_at"] = dayjs().toISOString();
        validatedRecord["uuid"] = v4();
        validatedRecord["region_id"] = id;
        validatedRecords.push(validatedRecord);
      }
    }
    await queryInterface.bulkInsert("countries", validatedRecords);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("countries", null, {});
  },
};
