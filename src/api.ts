import express from "express";
import cors from "cors";
import { corsOptionsDelegate } from "./helpers";
import bodyParser from "body-parser";
import ApiRoutes from "./routes/v1";
import db from "./db";
import multer from "multer";

const upload = multer();

const api: express.Application = express();

api.set("port", process.env.PORT || 3000);
api.options("*", cors(corsOptionsDelegate));
api.use(express.json());
api.use(bodyParser.json());
api.use("/v1", ApiRoutes);

// Should also test db connection when that is established.
api.get("/health", (req: express.Request, res: express.Response) => {
  res.sendStatus(200);
});

// @TODO - remove this
api.get("/dbname", (req: express.Request, res: express.Response) => {
  const name = db.sequelize.getDatabaseName();
  res.status(200).send(name);
});

// @TODO - remove this
api.get(
  "/dbconnection",
  async (req: express.Request, res: express.Response) => {
    let result = "unknown";
    try {
      result = await db.connect();
    } catch (e) {
      result = `Error: ${e}`;
    }
    res.status(200).send(result);
  }
);

// @TODO - remove this
api.get(
  "/v1/testpayload",
  async (req: express.Request, res: express.Response) => {
    const payload = {
      status: 200,
      data: [],
      errors: [],
    };

    try {
      const data = await db.regions.findAll({
        include: [
          {
            model: db.countries,
            attributes: ["iso_a3"],
          },
        ],
      });
      payload.data = data;
    } catch (e) {
      payload.status = 500;
      payload.errors.push(e.message);
    } finally {
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(payload));
    }
  }
);

api.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).send("path not found");
  }
);

export default api;
