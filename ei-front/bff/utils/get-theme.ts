import { Req } from '../types';


export function getTheme(req: Req): 'dark' | 'light' {
  const themeCookie = req.cookies['user-theme'];

  return Boolean(themeCookie)
    ? themeCookie === 'dark'
      ? 'dark'
      : 'light'
    : Boolean(req.headers['user-agent']) && req.headers['user-agent']?.includes('prefers-color-scheme: light')
      ? 'light'
      : 'dark';
}
