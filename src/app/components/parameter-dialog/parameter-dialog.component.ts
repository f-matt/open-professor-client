import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MessagesService} from "../../services/messages.service";
import {ParametersService} from "../../services/parameters.service";
import {Parameter} from "../../models/parameter";

@Component({
  selector: 'app-parameter-dialog',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatDialogModule,
    CdkTextareaAutosize
  ],
  templateUrl: './parameter-dialog.component.html',
  styleUrl: './parameter-dialog.component.scss'
})
export class ParameterDialogComponent implements OnInit {

  protected formGroup: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    value: new FormControl()
  });

  private messagesService: MessagesService = inject(MessagesService);

  private parametersService: ParametersService = inject(ParametersService);

  ngOnInit() {
    if (Object.keys(this.parametersService.selectedParameter()).length !== 0) {
     this.formGroup.patchValue(this.parametersService.selectedParameter());
    }
  }

  constructor(public dialogRef: MatDialogRef<ParameterDialogComponent>) {

  }

  save() {
    let parameter: Parameter = <Parameter> this.formGroup.value;
    this.parametersService.save(parameter).subscribe({
      next: (p: Parameter) => {
        this.dialogRef.close(p);
        this.messagesService.showMessage("Parameter successfully saved!");
      },
      error: (e: Error) => {
        this.messagesService.handleError(e, "Error saving parameter.");
      }
    });
  }

}
