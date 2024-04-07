import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar) { }

  login() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/');
          },
          error: (err) => {
            this.snackBar.open(err, "", { duration: 3000 });
          }
        });
    }
  }

}
