import ShopScreen from '@/src/features/shop/ShopScreen';
import { isShopUiEnabled } from '@/src/features/shop/shopFeature';
import { Redirect } from 'expo-router';
import React from 'react';

export default function ShopRoute() {
  if (!isShopUiEnabled()) {
    return <Redirect href="/home" />;
  }
  return <ShopScreen />;
}
