import 'reflect-metadata';

import { createExpressNestApp } from '../src/create-app';

import type { Request, Response } from 'express';

let cachedServer: Awaited<ReturnType<typeof createExpressNestApp>> | undefined;

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!cachedServer) {
    cachedServer = await createExpressNestApp();
  }

  cachedServer(req, res);
}
