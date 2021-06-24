import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/apiService';
import { EventBusService } from 'src/app/services/eventBusService';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  public id: any;
  public form: FormGroup;
  public show = false;
  public btnText = "Add";
  public updateMode = false;
  public date: any;
  public timings: any = [];
  public index: any;
  public timingInputFormat: any = [];
  public overlap = false;
  public mismatch = false;
  public teacherDetails: any;

  constructor(
    private eventBus: EventBusService,
    private fb: FormBuilder,
    private apiService:ApiService
  ) { }

  ngOnInit(): void {

    this.apiService.getId().subscribe(res => {
      this.id = res;
    })

    this.apiService.getTeacherDetails().subscribe((res: any) => {
      this.timingInputFormat = [];
      this.timings = [];
      if (res?.Classes) {
        this.timingInputFormat = res.Classes;
        res.Classes.forEach((time: any) => {
          this.timings.push(this.mapToTimeFormat(time))
        })
      }
    })

    this.buildForm();
    this.eventBus.on('showModal', (data: any) => {
      this.date = data;
      this.showModal();
    })

  }
  buildForm()
  {
    this.form = this.fb.group({
      startTime: [''],
      endTime: [''],
      date: [''],
    })
  }
  submit()
  {
    this.form.patchValue({
      ...this.form.value,
      date: this.date
    });
    const params = this.mapToTimeFormat(this.form.value);
    if (!this.checkOverLapping(params)) {
      this.mismatch = false;
      this.overlap = false;
      if (this.updateMode) {
        this.timings[this.index] = params;
        this.timingInputFormat[this.index] = this.form.value;
        this.updateTeacher();
        this.updateMode = false;
        this.index = undefined;
        this.btnText = "Add";
        this.addTime();
      }
      else {
        this.timings.push(params);
        this.timingInputFormat.push(this.form.value);
        this.updateTeacher();
        this.addTime();
      }
      this.form.reset();
    } else {
      if (!this.mismatch) {
        this.overlap = true;
      }
    }
  }

  updateTeacher() {
    const data:any = this.apiService.teacherDetails.getValue();
    this.apiService.teacherDetails.next({
      ...data,
      Classes:this.timingInputFormat
    });
  }
  update(index: any)
  {
    this.btnText = "Update"
    this.updateMode = true;
    this.index = index;
    this.form.patchValue(this.timingInputFormat[index]);
  }
  checkOverLapping(time: any):boolean {

    let flag: boolean = false;
    let startTimeHr = parseInt(time.startTime.slice(0, 2));
    let startTimeMin = parseInt(time.startTime.slice(3, 5));
    let endTimeHr = parseInt(time.endTime.slice(0, 2));
    let endTimeMin = parseInt(time.endTime.slice(3, 5));

    startTimeHr = (startTimeHr * 60) + startTimeMin;
    endTimeHr = (endTimeHr * 60) + endTimeMin;

    if (startTimeHr > endTimeHr)
    {
      this.overlap = false;
      this.mismatch = true;
      return true;
    }
    
    this.mismatch = false;

    this.timings.forEach((data: any,i:any) => {

      if (i != this.index) {
        let startHr = parseInt(data.startTime.slice(0, 2));
        let startMin = parseInt(data.startTime.slice(3, 5));
        let endHr = parseInt(data.endTime.slice(0, 2));
        let endMin = parseInt(data.endTime.slice(3, 5));
        startHr = (startHr * 60) + startMin;
        endHr = (endHr * 60) + endMin;
        if (startTimeHr < endHr && endTimeHr > startHr && data.date === this.date) {
          flag = true;
          return;
        }
      }

    });

    return flag;
  }

  mapToTimeFormat(data:any) {
    
    let startTime;
    let endTime;
    if (parseInt(data.startTime) >= 12) {
      startTime = data.startTime+" "+"PM"
    }
    else {
      startTime = data.startTime+" "+"AM"
    }
    if (parseInt(data.endTime) >= 12) {
      endTime = data.endTime+" "+"PM"
    }
    else {
      endTime = data.endTime+" "+"AM"
    }

    const Params = {
      startTime,
      endTime,
      date:data.date
    }
    return Params;

  }
  addTime() {
    this.apiService.addClass(this.id,this.timingInputFormat).subscribe(res => {
      console.log(res);
    })
  }
  delete(index:any)
  {
    this.timings.splice(index, 1);
    this.timingInputFormat.splice(index, 1);
    this.updateTeacher();
    this.addTime();
  }
  showModal()
  {
    this.show = !this.show;
  }
}
