import { Sequelize } from "sequelize";
import { initModels } from "./models/init-models";
import { countries } from "./models/countries";
import { regions } from "./models/regions";


export interface DbInterface {
  sequelize: Sequelize;
  connect: () => Promise<string>;
  countries: typeof countries;
  regions: typeof regions;
}

const env = process.env.NODE_ENV || "development";

const { DB_HOST, DB_NAME, DB_USER, DB_PW, DB_PORT } = process.env;

if (!DB_HOST || !DB_USER || !DB_PORT || !DB_NAME || !DB_PW) {
  console.log(
    `The following environment variables required for a database connection are missing: DB_HOST:${
      DB_HOST ? "not missing" : "missing"
    }, DB_USER:${DB_USER ? "not missing" : "missing"}, DB_PW:${
      DB_PW ? "not missing" : "missing"
    }, DB_PORT:${DB_PORT ? "not missing" : "missing"}, DB_NAME:${
      DB_NAME ? "not missing" : "missing"
    }`
  );
  process.exit(1);
}

const config = {
  url: `postgres://${DB_USER}:${DB_PW}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  dialect: "postgres",
};

let sequelize = null as Sequelize;

if (config.url > "") {
  sequelize = new Sequelize(config.url, {
    dialect: "postgres",
  });
}

const models = initModels(sequelize);

const connect = async () => {
  let status = "unknown";
  try {
    await sequelize.authenticate();
    status = "Connection has been established successfully.";
    console.log("Connection has been established successfully.");
  } catch (e) {
    status = `Unable to connect to the database: ${e}"`;
    console.error("Unable to connect to the database:", e);
  } finally {
    return status;
  }
};

const db: DbInterface = {
  sequelize: sequelize,
  ...models,
  connect,
};

export default db;
