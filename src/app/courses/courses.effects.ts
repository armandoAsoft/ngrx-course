import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CoursesHttpService } from "./services/courses-http.service";
import { CourseActions } from "./action-types";
import { concatMap, map } from "rxjs/operators";
import { allCoursesLoaded } from "./course.actions";
import { Course } from "./model/course";

@Injectable()
export class CoursesEffects {
  private actions$ = inject(Actions);
  private coursesHttpService = inject(CoursesHttpService);

  loadCourses$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.loadAllCourses),
    concatMap(action => this.coursesHttpService.findAllCourses()),
    map((courses: Course[]) => allCoursesLoaded({courses})    
    ))
  );

  saveCourse = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.courseUpdated),
      concatMap(action => this.coursesHttpService.saveCourse(action.update.id, action.update.changes))
    ), { dispatch: false }
  );
}