import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { filter, finalize, first, tap } from "rxjs/operators";
import { loadAllCourses } from "./course.actions";
import { areCoursesLoaded } from "./courses.selectors";

export const coursesResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  let loading = false
  return store.pipe(
    select(areCoursesLoaded),
    tap((coursesLoaded) => {
      if (!loading && !coursesLoaded) {
        loading = true;
        store.dispatch(loadAllCourses());
      }
    }),
    filter(coursesLoaded => coursesLoaded),
    first(),
    finalize(() => loading = false)
  )
}