export function injectScript(html: string, constName: string, data: Record<string, any> | Array<any> | null): string {
  const scriptContent = `\n<script>window.${constName} = ${JSON.stringify(data)};</script>`;

  return html.replace('</head>', `${scriptContent}\n</head>`);
}
