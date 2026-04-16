/**
 * Shopping UI is on by default. Set `EXPO_PUBLIC_ENABLE_SHOP_UI=false` in `.env` to turn it off
 * (the shop route redirects home; restart Metro after changing env).
 */
export function isShopUiEnabled(): boolean {
  const v = process.env.EXPO_PUBLIC_ENABLE_SHOP_UI?.trim().toLowerCase();
  return v !== 'false' && v !== '0' && v !== 'no';
}
