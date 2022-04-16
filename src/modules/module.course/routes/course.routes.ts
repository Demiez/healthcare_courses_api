import { Application } from 'express';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { CourseController } from '../controllers/course.controller';

export default (app: Application) => {
  const courseController = Container.get(CourseController);

  app.get(
    `${APP_ROOT}/courses`,
    wrapRouteAction((req, res, next) =>
      courseController.getAllCourses(req, res)
    )
  );

  app.get(
    `${APP_ROOT}/courses/:courseId`,
    wrapRouteAction((req, res, next) => courseController.getCourse(req, res))
  );

  app.delete(
    `${APP_ROOT}/courses/:courseId`,
    wrapRouteAction((req, res, next) => courseController.deleteCourse(req, res))
  );
};
