import { Application, Request, Response } from 'express';
import {
  ModuleAuth_AuthRoutes,
  ModuleCourse_CourseRoutes,
  ModuleMtc_MtcRoutes,
  ModuleSeeder_SeederRoutes,
} from '../../modules';
import { APP_ROOT, APP_ROOT_MESSAGE } from '../constants';
import { StandardResponseViewModel } from '../view-models';

export default (app: Application) => {
  app.get(APP_ROOT, (req: Request, res: Response) => {
    res
      .status(200)
      .send(new StandardResponseViewModel({}, APP_ROOT_MESSAGE, 'success'));
  });

  ModuleAuth_AuthRoutes(app);
  ModuleMtc_MtcRoutes(app);
  ModuleCourse_CourseRoutes(app);
  ModuleSeeder_SeederRoutes(app);
};
