import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './services';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, AsyncPipe ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public currentTheme$ = this.themeService.currentTheme$;

  constructor(
    private themeService: ThemeService,
  ) {
  }

  public ngOnInit(): void {
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
