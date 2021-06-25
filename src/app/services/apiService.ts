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
    public url = "https://scheduler-backend-chirag-tech.vercel.app"

    constructor(private http:HttpClient) {}

    getTeachers() {
        return this.http.get(`${this.url}/get`);
    }

    getTeacher(id: any) {
        this.http.get(`${this.url}/get/${id}`).subscribe((res: any) => {
            this.teacherDetails.next(res.data);
        })
    }

    addClass(id: any, data: any) {
        return this.http.put(`${this.url}/update/${id}`, data, httpOptions);
    }

    getTeacherDetails() {
        return this.teacherDetails.asObservable();
    }
    getId() {
        return this.teacherId.asObservable();
    }

  
}

