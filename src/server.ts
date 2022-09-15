import api from "./api";
import db from "./db";

const port = api.get("port");
const env = api.get("env");

const server = api.listen(port, async () => {
  await db.connect();

  console.log(
    "---> App is running at port %d in %s mode and connected to %s",
    port,
    env,
    db.sequelize.getDatabaseName()
  );

  console.log("---> Press CTRL-C to stop\n");
});

export default server;
