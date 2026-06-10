import type { Request, Response } from "express";

type ExpressApp = typeof import("../apps/api/src/app.js")["app"];

let appReady: Promise<ExpressApp> | undefined;
let mongoReady: Promise<void> | undefined;

async function loadApp() {
  appReady ??= Promise.all([
    import("../apps/api/src/app.js"),
    import("../apps/api/src/config/mongo.js")
  ]).then(([appModule, mongoModule]) => {
    mongoReady ??= mongoModule.connectMongo();
    return mongoReady.then(() => appModule.app);
  });

  return appReady;
}

export default async function handler(request: Request, response: Response) {
  const app = await loadApp();
  return app(request, response);
}
