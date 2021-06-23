import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/apiService';
import { EmitEvent, EventBusService } from 'src/app/services/eventBusService';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public id: any;
  public dates: any = [];
  public teachers:any = [];
  constructor(
    private eventBus: EventBusService,
    private apiService:ApiService
  ) { }

  ngOnInit(): void {
    this.getTeachers();
  }

  getTeachers() {

    this.apiService.getTeachers().subscribe((res: any) => {
      let len = res.length;
      let s = 0;
      for (let i = 1;i <= 31; i++)
      {
        this.dates.push(i);
      }
      this.teachers = res;
    })
  }

  getTeacherDetails() {
    this.apiService.teacherId.next(this.id);
    this.apiService.getTeacher(this.id).subscribe((res: any) => {
      
      this.apiService.teacherDetails.next(res);
    })
  }



  showModal(date:any) {
    this.eventBus.emit(new EmitEvent('showModal',date));
  }

}
