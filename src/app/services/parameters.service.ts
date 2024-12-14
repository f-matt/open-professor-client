import {Injectable, signal, WritableSignal} from '@angular/core';
import {environment} from "@environments/environment";
import {Parameter} from "../models/parameter";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomRuntimeError} from "../errors/custom-runtime-error";

const BASE_URL = environment.apiUrl;

const PARAMETERS_PATH = "parameters";

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  public selectedParameter: WritableSignal<Parameter> = signal<Parameter>({});

  constructor(private httpClient: HttpClient) { }

  search(name: string): Observable<Parameter[]> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set("name", name);

    return this.httpClient.get<Parameter[]>(`${BASE_URL}/${PARAMETERS_PATH}`, {params: httpParams});
  }

  save(parameter: Parameter): Observable<Parameter> {
    if (!parameter)
      throw new CustomRuntimeError("Parameter is mandatory.");

    if (parameter.id)
      return this.httpClient.patch<Parameter>(`${BASE_URL}/${PARAMETERS_PATH}`, parameter);
    else
      return this.httpClient.post<Parameter>(`${BASE_URL}/${PARAMETERS_PATH}`, parameter);
  }

}
