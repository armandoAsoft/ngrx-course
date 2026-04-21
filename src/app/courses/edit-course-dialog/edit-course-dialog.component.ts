import {ChangeDetectionStrategy, Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CoursesHttpService} from '../services/courses-http.service';
import { Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { courseUpdated } from '../course.actions';
import { CourseEntityService } from '../services/course-entity.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCourseDialogComponent {
  private store = inject(Store);
  private data = inject(MAT_DIALOG_DATA);
  private coursesService = inject(CourseEntityService);

  form!: UntypedFormGroup;

  dialogTitle: string;

  course: Course;

  mode: 'create' | 'update';

  loading$?:Observable<boolean>;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>) {

    this.dialogTitle = this.data.dialogTitle;
    this.course = this.data.course;
    this.mode = this.data.mode;

    const formControls = {
      description: ['', Validators.required],
      category: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: ['', []]
    };

    if (this.mode == 'update') {
      this.form = this.fb.group(formControls);
      this.form.patchValue({...this.data.course});
    }
    else if (this.mode == 'create') {
      this.form = this.fb.group({
        ...formControls,
        url: ['', Validators.required],
        iconUrl: ['', Validators.required]
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {

    const course: Course = {
      ...this.course,
      ...this.form.value
    };

    // this.coursesService.saveCourse(course.id, course)
    //   .subscribe(
    //     () => this.dialogRef.close()
    //   )

    // const update: Update<Course> = {
    //   id: course.id,
    //   changes: course
    // };

    // this.store.dispatch(courseUpdated({ update }));

    if (this.mode == 'update') {
      this.coursesService.update(course);
      this.dialogRef.close();
    } else if (this.mode == 'create') {
      this.coursesService.add(course).subscribe(
        () => this.dialogRef.close()
      );
    }
    
  }


}
