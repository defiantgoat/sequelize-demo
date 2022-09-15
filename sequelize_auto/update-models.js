/* eslint-disable */
const SequelizeAuto = require("sequelize-auto");
const env = require("dotenv").config({ path: "./.env" });
 
if (env.parsed) {
 try {
   const { DB_NAME, DB_HOST, DB_USER, DB_PORT, DB_PW } = env.parsed;
 
   const auto = new SequelizeAuto(DB_NAME, DB_USER, DB_PW, {
     host: DB_HOST,
     dialect: "postgres",
     directory: "./src/db/models",
     port: DB_PORT,
     caseModel: "l",
     caseFile: "l",
     additional: {
       timestamps: false,
       underscored: true,
     },
     lang: "ts",
     skipTables: ["SequelizeMeta"],
    //  tables: [], // use all tables, if omitted
     views: true,
     noAlias: true,
   });
 
   auto.run().then(() => {
     process.exit(0);
   });
 } catch (e) {
   process.exit(1);
 }
}

