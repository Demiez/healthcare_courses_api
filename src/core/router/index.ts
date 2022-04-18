import { Application, Request, Response } from 'express';
import { ModuleCourse_CourseRoutes } from '../../modules/module.course';
import { ModuleMtc_MtcRoutes } from '../../modules/module.mtc';
import { ModuleSeeder_SeederRoutes } from '../../modules/module.seeder';
import { APP_ROOT, APP_ROOT_MESSAGE } from '../constants';
import { StandardResponseViewModel } from '../view-models';

export default (app: Application) => {
  app.get(APP_ROOT, (req: Request, res: Response) => {
    res
      .status(200)
      .send(new StandardResponseViewModel({}, APP_ROOT_MESSAGE, 'success'));
  });

  ModuleMtc_MtcRoutes(app);
  ModuleCourse_CourseRoutes(app);
  ModuleSeeder_SeederRoutes(app);
};
