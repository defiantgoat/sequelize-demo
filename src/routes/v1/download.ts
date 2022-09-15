import { Router, Request, Response } from "express";
import * as csvWriter from "csv-writer";
import os from "os";
import path from "path";
import Controllers from "../../controllers";

const DownloadRouter = Router();

DownloadRouter.get(
  "/:table/:type",
  async (req: Request, res: Response) => {
    const acceptableFileExtentions = ["csv", "tsv"];

    const payload = {
      status: 200,
      data: [],
      errors: [],
    };

    const { type } = req.params;
    const { table } = req.params;

    if (type && !acceptableFileExtentions.includes(type)) {
      payload.status = 500;
      payload.errors.push(
        `Not an acceptable type: ${acceptableFileExtentions.join(",")}`
      );
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(payload));
      return;
    }

    const outputPath = path.resolve(os.tmpdir(), `${table}.csv`);

    try {
      const controller = Controllers[table];
      if (controller) {
        const result = await controller.getValuesForCSV();
        const header = Object.keys(result[0]).map((key) => ({
          id: key,
          title: key,
        }));
        const writer = csvWriter.createObjectCsvWriter({
          path: outputPath,
          header,
        });
        await writer.writeRecords(result);
        res.setHeader("Content-Type", "text/csv");
        res.download(outputPath, `${table}.csv`);
      } else {
        payload.status = 500;
        payload.errors.push(`${table} - Table does not exist`);
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(payload));
      }
    } catch (e) {
      payload.status = 500;
      payload.errors.push(e.message);
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(payload));
    }
  }
);

export default DownloadRouter;
