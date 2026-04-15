import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { finalize, first, tap } from "rxjs/operators";
import { loadAllCourses } from "./course.actions";

export const coursesResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  let loading = false
  return store.pipe(
    tap(() => {
      if (!loading) {
        loading = true;
        store.dispatch(loadAllCourses());
      }
    }),
    first(),
    finalize(() => loading = false)
  )
}