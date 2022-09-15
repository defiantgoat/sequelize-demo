import { Router, Request, Response } from "express";

import CountriesController from "../../controllers/countries_controller";

const CountriesRouter = Router();

CountriesRouter.get("/", async (req: Request, res: Response) => {
  const payload = {
    status: 200,
    data: [],
    errors: [],
  };
  res.setHeader("Content-Type", "application/json");

  try {
    const data = await CountriesController.getAllCountries();
    payload.data = data;
  } catch (e) {
    payload.status = 500;
    payload.errors.push(e);
    res.status(500).send(JSON.stringify(payload));
  } finally {
    res.status(200).send(JSON.stringify(payload));
  }
});


export default CountriesRouter;
