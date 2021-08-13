import { Application, Request, Response } from 'express';
import { APP_ROOT, APP_ROOT_MESSAGE } from '../contants';
import { StandardResponseViewModel } from '../view-models';

export default (app: Application) => {
  app.get(APP_ROOT, (req: Request, res: Response) => {
    res
      .status(200)
      .send(new StandardResponseViewModel(APP_ROOT_MESSAGE, 'success'));
  });
};
