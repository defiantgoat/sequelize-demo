import { CorsOptionsDelegate } from "cors";
import { Request } from "express";

export const corsOptionsDelegate: CorsOptionsDelegate = (
  req: Request,
  callback: any
) => {
  console.log("origin", req.headers.origin)
  const options = {
    origin: [/(localhost)/, "https://s3.amazonaws.com"], ///(localhost)|(https:\/\/s3.amazonaws.com\/)/,
    allowedHeaders: "Cache-Control, Content-Type, Authorization",
    methods: ["OPTIONS", "GET", "POST", "PUT"],
  };
  callback(null, options);
};
