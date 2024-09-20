import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NgIf } from '@angular/common';
import { MatMenuItem, MatMenuTrigger, MatMenu } from '@angular/material/menu';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatToolbar, MatIconButton, MatIcon, MatSidenavContainer, MatSidenav, NgIf, MatMenuItem, MatMenuTrigger, MatMenu, RouterLink, MatSidenavContent, RouterOutlet]
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
