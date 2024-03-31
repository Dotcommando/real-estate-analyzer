import { Meta, MetaDefinition, Title } from '@angular/platform-browser';


export class AbstractSeoFriendlyPageComponent {
  protected metaTags!: Required<Pick<MetaDefinition, 'name' | 'content'>>[];
  protected titleTagContent!: string;

  constructor(
    private readonly meta: Meta,
    private readonly title: Title,
  ) {
  }

  protected initMeta(): void {
    if (this.metaTags?.length) {
      for (const meta of this.metaTags) {
        this.meta.addTag({ name: meta.name, content: meta.content });
      }
    }

    this.titleTagContent && this.title.setTitle(this.titleTagContent);
  }
}
