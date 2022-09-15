import { Router } from "express";
import cors from "cors";
import { corsOptionsDelegate } from "../../helpers";
import DownloadRouter from "./download";
import CountriesRouter from "./countries";

const ApiRoutes = Router();

ApiRoutes.all("*", cors(corsOptionsDelegate));

ApiRoutes.use("/download", DownloadRouter);
ApiRoutes.use("/countries", CountriesRouter);

export default ApiRoutes;
