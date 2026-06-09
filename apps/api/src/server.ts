import { app } from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { env } from "./config/env.js";

await connectMongo();

app.listen(env.port, () => {
  console.log(`Floydee API listening on http://localhost:${env.port}`);
});
