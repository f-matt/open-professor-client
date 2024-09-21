import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatMenuModule, 
      MatIconModule, 
      MatToolbarModule,
      MatSidenavModule, 
      MatButtonModule,
      RouterModule, 
      RouterModule,
      CommonModule]
})
export class AppComponent {
  title = 'openProfessorClient';

  constructor(protected authService: AuthService,
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
        this.snackBar.open("Error checking permission.", "", { duration : 3000});
    }

    return false;
  }

}
