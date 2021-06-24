import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    })
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
   
    public teacherId = new BehaviorSubject('');
    public teacherDetails = new BehaviorSubject('');

    constructor(private http:HttpClient) {}

    getTeachers() {
        return this.http.get("https://pacific-depths-47458.herokuapp.com/get");
    }

    getTeacher(id: any) {
        this.http.get(`https://pacific-depths-47458.herokuapp.com/get/${id}`).subscribe((res: any) => {
            this.teacherDetails.next(res.data);
        })
    }

    addClass(id: any, data: any) {
        return this.http.put(`https://pacific-depths-47458.herokuapp.com/update/${id}`, data, httpOptions);
    }

    getTeacherDetails() {
        return this.teacherDetails.asObservable();
    }
    getId() {
        return this.teacherId.asObservable();
    }

  
}

