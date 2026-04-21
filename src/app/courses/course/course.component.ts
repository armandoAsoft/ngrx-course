import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {CoursesHttpService} from '../services/courses-http.service';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  private coursesService = inject(CourseEntityService);
  private lessonsService = inject(LessonEntityService);
  course$!: Observable<Course>;

  lessons$!: Observable<Lesson[]>;

  loading = toSignal(this.lessonsService.loading$, {initialValue: false});

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;
  isAllLessonsLoaded = false;

  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    // this.course$ = this.coursesService.findCourseByUrl(courseUrl);
    
    this.course$ = this.coursesService.entities$.pipe(
      map(courses => courses.find(course => course.url == courseUrl)),
      filter(course => !!course),
    );

    // this.lessons$ = this.course$.pipe(
    //   concatMap(course => this.coursesService.findLessons(course.id)),
    //   tap(console.log)
    // );

    this.lessonsService.count$.pipe(
      withLatestFrom(this.course$)
    ).subscribe(([count, course]) => this.isAllLessonsLoaded = count >= course.lessonsCount);

    this.lessons$ = this.lessonsService.entities$.pipe(
      withLatestFrom(this.course$),
      tap(([lessons, course]) => {
        if (this.nextPage == 0) {
          this.loadLessonsPage(course);
        }
      }),
      map(([lessons, course]) => lessons.filter(lesson => lesson.courseId == course.id))
    );
  }


  loadLessonsPage(course: Course) {
    this.lessonsService.getWithQuery({
      courseId: course.id.toString(),
      pageNumber: this.nextPage.toString(),
      pageSize: '3',
    });

    this.nextPage++;
  }
}
