import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course';
import { map } from 'rxjs';
import { environment } from '@environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private httpClient : HttpClient) { }

  save(course : Course) : Observable<any> {

    let data = {'name' : course.name};

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post<any>(`${BASE_URL}/courses`, data, httpOptions);
  }

  getAll() : Observable<Course[]> {
    return this.httpClient.get<any>(`${BASE_URL}/courses`).pipe(map(data => data));
  }

}
