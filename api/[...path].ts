import type { Request, Response } from "express";

type ExpressApp = typeof import("../apps/api/src/app.js")["app"];

let appReady: Promise<ExpressApp> | undefined;

async function loadApp() {
  appReady ??= import("../apps/api/src/app.js").then((appModule) => appModule.app);

  return appReady;
}

export default async function handler(request: Request, response: Response) {
  const app = await loadApp();
  return app(request, response);
}
