import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'openProfessorClient';

  constructor(private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasPermission(permission:string) {
    try {
      return this.authService.hasPermission(permission);
    } catch (e: unknown) {
      if (e instanceof Error)
        this.snackBar.open(e.message, "", {"duration":3000});
      else
        this.snackBar.open("Ocorreu um erro ao veriifcar as permissões.", "", {"duration":3000});
    }

    return false;
  }

}
