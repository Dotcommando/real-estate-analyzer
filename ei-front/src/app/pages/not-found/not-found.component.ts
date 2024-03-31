import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { AbstractSeoFriendlyPageComponent } from '../../components/abstract-seo-friendly-page';


@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent extends AbstractSeoFriendlyPageComponent implements OnInit {
  constructor(
    meta: Meta,
    title: Title,
  ) {
    super(meta, title);

    this.metaTags = [
      { name: 'description', content: 'Page Not Found' },
    ];

    this.titleTagContent = 'Page Not Found, 404';
  }

  public ngOnInit(): void {
    this.initMeta();
  }
}
