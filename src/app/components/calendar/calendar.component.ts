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
   
    this.setDates();
    this.getTeachers();
  }

  getTeachers() {

    this.apiService.getTeachers().subscribe((res: any) => {
      console.log(res);
      this.teachers = res.data;
    })
  }

  setDates()
  {
    this.dates = [];
    for (let i = 1;i <= 31; i++)
    {
      this.dates.push({
        classes: false,
        date:i
      });
    }
  }
  getTeacherDetails() {
    this.apiService.teacherId.next(this.id);
    this.apiService.getTeacher(this.id);
    this.apiService.getTeacherDetails().subscribe((res: any) => {
      this.setDates();
      if (res?.Classes) {
        res.Classes.forEach((data: any) => {
          this.dates[data.date - 1].classes = true;
        })
      }
    })
  }



  showModal(date:any) {
    this.eventBus.emit(new EmitEvent('showModal',date.date));
  }

}
