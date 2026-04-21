import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CoursesDataService extends DefaultDataService<Course> {
  // private http = inject(HttpClient);
  // private httpUrlGeneraqtor = inject(HttpUrlGenerator);

  constructor(http: HttpClient, httpUrlGeneraqtor: HttpUrlGenerator) {
    super('Course', http, httpUrlGeneraqtor);
  }

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses').pipe(
      map((res: any) => res['payload'])
    );
  }
}