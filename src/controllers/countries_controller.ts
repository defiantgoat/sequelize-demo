import db from "../db";
import { countriesAttributes } from "../db/models/countries";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import schemas from "../schemas";
import { TABLE_NAMES } from "../constants";

interface CountriesControllerProps {
  getAllCountries(): Promise<countriesAttributes[]>;
  bulkUpdateOrCreate(updateProps: { records: any[] }): Promise<any>;
  getValuesForCSV(): Promise<countriesAttributes[]>;
}

const { countries } = db;

const CountriesController: CountriesControllerProps = {
  getValuesForCSV: async () => {
    const data = await countries.findAll({
      attributes: [
        "name",
        "iso_a3",
        [db.sequelize.literal('"region"."display_name"'), "region_name"],
        "uuid",
      ],
      include: [
        {
          model: db.regions,
          attributes: [],
        },
      ],
      raw: true,
    });

    return data;
  },
  getAllCountries: async () => {
    const data = await countries.findAll({
      include: [
        {model: db.regions, attributes: ["display_name", "name"]},
      ]
    });
    return data;
  },

  bulkUpdateOrCreate: async ({ records }) => {
    let payload = {
      data: [],
      errors: [],
    };
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const data = [];
        for (const record of records) {
          const { error, value: validatedRecord } =
            schemas[TABLE_NAMES.Countries].validate(record);

          if (error) {
            payload.errors.push(error);
            continue;
          }

          let { uuid } = validatedRecord;
          const exists = await countries.findOne({
            where: { uuid },
            transaction: t,
          });
          if (!exists) {
            validatedRecord["created_at"] = dayjs();
            validatedRecord["updated_at"] = dayjs();
            validatedRecord["uuid"] = uuidv4();
            const newRecord = await countries.create(validatedRecord, {
              transaction: t,
            });
            data.push(newRecord);
          } else {
            validatedRecord["updated_at"] = dayjs();
            const [val, [updatedRecord]] = await countries.update(
              validatedRecord,
              { where: { uuid }, returning: true, transaction: t }
            );
            data.push(updatedRecord);
          }
        }

        return data;
      });
      payload.data = result;
    } catch (e) {
      payload.errors.push(e);
    }

    return payload;
  },
};

export default CountriesController;
