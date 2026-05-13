/**
 * Bottom tab keys shared by Home.
 * Keeps active-state detection consistent across platforms / path shapes.
 */
import type { MainTabKey } from '@/src/i18n/ui/types';

export type { MainTabKey };

export function mainTabIsActive(
  pathname: string | undefined,
  segments: readonly string[],
  key: MainTabKey,
): boolean {
  const path = (pathname ?? '').split('?')[0].replace(/\/$/, '') || '/';
  const hasSeg = (s: string) => segments.includes(s);
  switch (key) {
    case 'home':
      return path === '/home' || path.startsWith('/home/') || hasSeg('home');
    case 'cards':
      return (
        path === '/my-cards' ||
        path.startsWith('/my-cards/') ||
        hasSeg('my-cards') ||
        path === '/card-journey' ||
        path.startsWith('/card-journey/') ||
        hasSeg('card-journey')
      );
    case 'analytics':
      return path === '/analytics' || path.startsWith('/analytics/') || hasSeg('analytics');
    case 'shop':
      return path === '/shop' || path.startsWith('/shop/') || hasSeg('shop');
    case 'profile':
      return path === '/profile' || path.startsWith('/profile/') || hasSeg('profile');
    default:
      return false;
  }
}
