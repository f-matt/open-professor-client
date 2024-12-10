import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CustomRuntimeError} from "../errors/custom-runtime-error";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private snackBar : MatSnackBar) { }

  showMessage(message : string) {
    this.snackBar.open(message, "", { "duration" : 3000 });
  }

  handleError(error : Error, defaultMessage : string) {
    if (error instanceof CustomRuntimeError)
      this.snackBar.open(error.message, "", { "duration" : 3000 });
    else
      this.snackBar.open(defaultMessage, "", { "duration" : 3000});
  }

}
