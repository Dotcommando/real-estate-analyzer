import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './services';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
  ) {
  }

  public ngOnInit(): void {
    const preferredTheme = this.themeService.getPreferredTheme();

    console.log(preferredTheme);

    this.themeService.setTheme(preferredTheme);
  }
}
