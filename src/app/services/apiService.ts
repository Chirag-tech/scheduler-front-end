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
        return this.http.get("http://localhost:8080/get");
    }

    getTeacher(id: any) {
        return this.http.get(`http://localhost:8080/get/${id}`);
    }

    addClass(id: any, data: any) {
        return this.http.put(`http://localhost:8080/update/${id}`, data, httpOptions);
    }

    getTeacherDetails() {
        return this.teacherDetails.asObservable();
    }
    getId() {
        return this.teacherId.asObservable();
    }

  
}

