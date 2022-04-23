import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { join } from 'path';
import { registerSwagger } from '../swagger';
import errorHandlingMiddleware from './core/middlewares/error-handling.middleware';
import router from './core/router';

require('dotenv').config();

class App {
  public app = express();

  constructor() {
    this.app.use(cookieParser());
    this.app.use(bodyParser.json({ limit: '100mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());

    this.app.use(express.static(join(process.cwd(), '/public')));

    router(this.app);
    registerSwagger(this.app);

    errorHandlingMiddleware(this.app);
  }
}

export default new App().app;
