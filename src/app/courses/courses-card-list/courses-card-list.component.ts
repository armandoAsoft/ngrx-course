import {ChangeDetectionStrategy, Component, EventEmitter, inject, input, Input, OnInit, output, Output, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditCourseDialogComponent} from "../edit-course-dialog/edit-course-dialog.component";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import { CourseEntityService } from '../services/course-entity.service';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent implements OnInit {

  courses =  input<Course[]>([]);

  courseChanged = output<Course>();
  private coursesService = inject(CourseEntityService);

  constructor(
    private dialog: MatDialog ) {
  }

  ngOnInit() {

  }

  editCourse(course:Course) {

      const dialogConfig = defaultDialogConfig();

      dialogConfig.data = {
        dialogTitle:"Edit Course",
        course,
        mode: 'update'
      };

      this.dialog.open(EditCourseDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => this.courseChanged.emit(course));

  }

  onDeleteCourse(course:Course) {
    this.coursesService.delete(course.id);

  }

}









