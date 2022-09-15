"use strict";
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const path = require("path");
const dayjs = require("dayjs");
const { v4 } = require("uuid");
const Joi = require("joi");

const regionsSchema = Joi.object({
  name: Joi.string(),
  boundary: Joi.object(),
  uuid: Joi.string().allow(null, ""),
});

module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingRecords] = await queryInterface.sequelize.query(
      "SELECT id from regions"
    );
    if (existingRecords.length > 0) {
      // records exist, do not re-seed
      console.log("Records exist. Not re-seeding");
      return;
    }

    const data = fs.readFileSync(
      path.resolve(__dirname, "../data/regions.csv")
    );
    const records = parse(data, { columns: true, bom: true });
    const validatedRecords = [];
    for (const record of records) {
      const { error, value: validatedRecord } = regionsSchema.validate(record);
      if (validatedRecord) {
        validatedRecord["created_at"] = dayjs().toISOString();
        validatedRecord["updated_at"] = dayjs().toISOString();
        validatedRecord["uuid"] = v4();
        validatedRecords.push(validatedRecord);
      }
    }
    await queryInterface.bulkInsert("regions", validatedRecords);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("regions", null, {});
  },
};
