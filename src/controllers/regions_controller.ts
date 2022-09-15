import db from "../db";
import { regionsAttributes } from "../db/models/regions";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import schemas from "../schemas";
import { TABLE_NAMES } from "../constants";

interface RegionsControllerProps {
  getAllRegions(): Promise<regionsAttributes[]>;
  bulkUpdateOrCreate(updateProps: { records: any[] }): Promise<any>;
  getValuesForCSV(): Promise<regionsAttributes[]>;
}

const { regions } = db;

const RegionsController: RegionsControllerProps = {
  getValuesForCSV: async () => {
    const data = await regions.findAll({
      attributes: ["name", "display_name", "uuid"],
      raw: true,
    });

    return data;
  },
  getAllRegions: async () => {
    const data = await regions.findAll();
    return data;
  },

  bulkUpdateOrCreate: async ({ records }) => {
    const payload = {
      data: [],
      errors: [],
    };
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const data = [];
        for (const record of records) {
          const { error, value: validatedRecord } =
            schemas[TABLE_NAMES.Regions].validate(record);

          if (error) {
            payload.errors.push(error);
            continue;
          }

          const { uuid } = validatedRecord;
          const exists = await regions.findOne({
            where: { uuid },
            transaction: t,
          });
          if (!exists) {
            validatedRecord["created_at"] = dayjs();
            validatedRecord["updated_at"] = dayjs();
            validatedRecord["uuid"] = uuidv4();
            const newRecord = await regions.create(validatedRecord, {
              transaction: t,
            });
            data.push(newRecord);
          } else {
            validatedRecord["updated_at"] = dayjs();
            const [val, [updatedRecord]] = await regions.update(
              validatedRecord,
              {
                where: { uuid },
                returning: true,
                transaction: t,
              }
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

export default RegionsController;
