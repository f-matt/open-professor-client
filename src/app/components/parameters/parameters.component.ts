import { Component } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MessagesService} from "../../services/messages.service";
import {MatTableModule} from "@angular/material/table";
import {DataSourceWrapper} from "../../utils/data-source-wrapper";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ParametersService} from "../../services/parameters.service";
import {Parameter} from "../../models/parameter";

@Component({
  selector: 'app-parameters',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent {

  protected form: FormGroup = new FormGroup({
    name: new FormControl()
  });

  private parameters: Parameter[] = [];

  protected dataSourceWrapper: DataSourceWrapper<Parameter> = new DataSourceWrapper(this.parameters,
    ["id", "name", "value", "actions"]);

  constructor(private messagesService: MessagesService, private parametersService: ParametersService) {

  }

  search() {
    let name: string = this.form.value["name"];
    if (!name) {
      this.messagesService.showMessage("Please enter a name.");
      return;
    }

    this.parametersService.search(name).subscribe({
      next: (parameters: Parameter[]) => {
        this.parameters = parameters;
        this.dataSourceWrapper.update(this.parameters);
        if (this.parameters.length < 1)
          this.messagesService.showMessage("No parameters found with the given name.");
      },
      error: (e: Error)=> {
        this.messagesService.handleError(e, "Error searching parameters.");
      }
    });
  }

  new() {
    this.messagesService.showMessage("Under construction...");
  }

  edit(parameter: Parameter) {
    this.messagesService.showMessage("Editing parameter " + parameter.name + "...");
  }

}
