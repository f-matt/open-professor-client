import {Injectable, signal, WritableSignal} from '@angular/core';
import {environment} from "@environments/environment";
import {Parameter} from "../models/parameter";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

const BASE_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  public selectedParameter: WritableSignal<Parameter> = signal<Parameter>({});

  constructor(private httpClient: HttpClient) { }

  search(name: string): Observable<Parameter[]> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set("name", name);

    return this.httpClient.get<Parameter[]>(`${BASE_URL}/parameters`, {params: httpParams});
  }

}
