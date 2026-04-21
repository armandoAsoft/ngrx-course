import { ResolveFn } from "@angular/router";
import { Course } from "../model/course";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { CourseEntityService } from "./course-entity.service";
import { filter, first, tap } from "rxjs/operators";

export const coursesResolver: ResolveFn<boolean> = (route, state) => {
  const courseService = inject(CourseEntityService);

  return courseService.loaded$.pipe(
    tap(loaded => {
      if (!loaded) {
        courseService.getAll();
      }
    }),
    filter(loaded => !!loaded),
    first()
  );
};