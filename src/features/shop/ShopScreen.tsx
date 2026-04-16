import { TextField } from '@/src/components/TextField';
import { MOCK_SHOP_REVIEWS, SHOP_BULK_EMAIL } from '@/src/constants/mockShopData';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import type { AppThemeColors, ColorMode } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { formatUiString } from '@/src/i18n/ui/formatUiString';
import type { MainTabKey } from '@/src/i18n/ui/types';
import { Ionicons } from '@expo/vector-icons';
import { mainTabIsActive } from '@/src/navigation/mainTabNav';
import { router, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const STAR = '#fbbf24';

const SHOP_TIERS = [
  { id: 1 as const, qty: 1, price: 10 },
  { id: 2 as const, qty: 2, price: 17 },
  { id: 3 as const, qty: 3, price: 20 },
];

function paramToString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return undefined;
}

function createStyles(c: AppThemeColors, colorMode: ColorMode) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg },
    guestRibbon: {
      backgroundColor: c.surface,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    guestRibbonText: { fontSize: 12, fontWeight: '600', color: c.muted, textAlign: 'center' },
    scroll: { paddingHorizontal: 20, paddingTop: 12 },
    titleRow: { marginBottom: 8 },
    pageTitle: { fontSize: 26, fontWeight: '800', color: c.text },
    pageSub: { fontSize: 14, color: c.muted, marginTop: 6, lineHeight: 20 },
    howItWorksCta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#16a34a',
      backgroundColor: '#22c55e',
      marginBottom: 20,
      shadowColor: '#16a34a',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 4,
    },
    howItWorksCtaText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.2, color: '#052e16' },
    heroCard: {
      backgroundColor: colorMode === 'light' ? '#18181b' : '#0a0a0c',
      borderRadius: 16,
      padding: 18,
      marginBottom: 22,
      borderWidth: 1,
      borderColor: colorMode === 'light' ? '#27272a' : '#2a2a30',
    },
    heroBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(250,250,250,0.12)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: 10,
    },
    heroBadgeText: { fontSize: 10, fontWeight: '800', color: '#fafafa', letterSpacing: 0.6 },
    heroTitle: { fontSize: 20, fontWeight: '800', color: '#fafafa', marginBottom: 8 },
    heroBody: { fontSize: 14, color: 'rgba(250,250,250,0.72)', lineHeight: 20 },
    shipPill: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    shipPillText: { fontSize: 13, fontWeight: '600', color: '#86efac' },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: c.text, marginBottom: 6 },
    sectionHint: { fontSize: 13, color: c.muted, marginBottom: 14, lineHeight: 18 },
    tierRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    tierCard: {
      flex: 1,
      minWidth: '30%',
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: c.border,
      padding: 14,
    },
    tierQty: { fontSize: 12, fontWeight: '700', color: c.muted, textTransform: 'uppercase', marginBottom: 6 },
    tierPrice: { fontSize: 22, fontWeight: '800', color: c.text },
    tierSub: { fontSize: 11, color: c.muted, marginTop: 6, lineHeight: 15 },
    infoCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 24,
      gap: 10,
    },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    infoText: { flex: 1, fontSize: 14, color: c.muted, lineHeight: 20 },
    bulkCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 24,
    },
    bulkActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
    primaryBtn: {
      flex: 1,
      minWidth: 140,
      backgroundColor: c.accent,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    primaryBtnText: { fontSize: 15, fontWeight: '700', color: c.onAccent },
    secondaryBtn: {
      flex: 1,
      minWidth: 140,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: colorMode === 'light' ? c.surface : c.surface2,
    },
    secondaryBtnText: { fontSize: 15, fontWeight: '600', color: c.text },
    addOnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    addOn: {
      width: '48%',
      flexGrow: 1,
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 14,
      gap: 6,
    },
    addOnTitle: { fontSize: 14, fontWeight: '700', color: c.text },
    addOnPrice: { fontSize: 13, fontWeight: '600', color: c.accent },
    addOnSub: { fontSize: 12, color: c.muted, lineHeight: 16 },
    addOnHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    addOnActive: { borderColor: c.accent, borderWidth: 2 },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 10,
    },
    stepperBtn: {
      width: 40,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: colorMode === 'light' ? c.surface : c.surface2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperValue: { fontSize: 16, fontWeight: '700', color: c.text, minWidth: 28, textAlign: 'center' },
    orderCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 24,
      gap: 10,
    },
    orderTitle: { fontSize: 16, fontWeight: '700', color: c.text, marginBottom: 4 },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
    orderRowLabel: { flex: 1, fontSize: 14, color: c.muted },
    orderRowValue: { fontSize: 14, fontWeight: '600', color: c.text },
    orderDivider: { height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginVertical: 4 },
    orderTotalLabel: { fontSize: 16, fontWeight: '800', color: c.text },
    orderTotalValue: { fontSize: 18, fontWeight: '800', color: c.accent },
    checkoutCta: {
      marginTop: 6,
      backgroundColor: c.accent,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    checkoutCtaText: { fontSize: 16, fontWeight: '700', color: c.onAccent },
    giftWrapToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
      paddingVertical: 8,
    },
    giftWrapToggleText: { flex: 1, fontSize: 14, fontWeight: '600', color: c.text },
    giftWrapCard: {
      backgroundColor: `${c.accent}14`,
      borderWidth: 1,
      borderColor: `${c.accent}44`,
      borderRadius: 14,
      padding: 16,
      marginBottom: 24,
    },
    giftWrapTitle: { fontSize: 15, fontWeight: '700', color: c.text, marginBottom: 6 },
    giftWrapBody: { fontSize: 14, color: c.muted, lineHeight: 20 },
    giftAmountRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    giftChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
    },
    giftChipText: { fontSize: 14, fontWeight: '600' },
    reviewCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 12,
    },
    reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    reviewName: { fontSize: 15, fontWeight: '700', color: c.text },
    reviewDate: { fontSize: 12, color: c.muted },
    starsRow: { flexDirection: 'row', gap: 2, marginBottom: 6 },
    reviewTitle: { fontSize: 14, fontWeight: '600', color: c.text, marginBottom: 4 },
    reviewBody: { fontSize: 14, color: c.muted, lineHeight: 20 },
    bottomNav: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      paddingTop: 10,
      backgroundColor: c.bottomNavBg,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    tabItem: { alignItems: 'center', gap: 4, minWidth: 56 },
    tabLabel: { fontSize: 10, color: c.muted, fontWeight: '500' },
    tabLabelActive: { color: c.text, fontWeight: '700' },
    leadField: { marginBottom: 4 },
    inlineNotice: {
      fontSize: 13,
      lineHeight: 18,
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    inlineNoticeOk: {
      backgroundColor: `${c.accent}18`,
      color: c.text,
    },
    inlineNoticeErr: {
      backgroundColor: colorMode === 'light' ? '#fef2f2' : '#3f1d1d',
      color: colorMode === 'light' ? '#991b1b' : '#fecaca',
    },
  });
}

const GIFT_AMOUNTS = [10, 25, 50, 75, 100] as const;

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const raw = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const guestRaw = (paramToString(raw.guest) || '').toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';

  const { u } = useAppPreferences();
  const { profile, colors, refreshMyCards } = useUserProfile();
  const [bulkCompany, setBulkCompany] = useState('');
  const [bulkEmail, setBulkEmail] = useState('');
  const [bulkQty, setBulkQty] = useState('');
  const [selectedGift, setSelectedGift] = useState<number>(25);
  const [bulkNotice, setBulkNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [giftSelectionNote, setGiftSelectionNote] = useState<string | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<1 | 2 | 3>(1);
  const [engravingOn, setEngravingOn] = useState(false);
  const [stickerCount, setStickerCount] = useState(0);
  const [giftWrapOn, setGiftWrapOn] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const cart = useMemo(() => {
    const tier = SHOP_TIERS.find((t) => t.id === selectedTierId)!;
    const bundle = tier.price;
    const engraving = engravingOn ? tier.qty * 10 : 0;
    const stickers = stickerCount * 1;
    const total = bundle + engraving + stickers;
    return { tier, bundle, engraving, stickers, total };
  }, [selectedTierId, engravingOn, stickerCount]);

  const journeyParams = useMemo(() => {
    const p: Record<string, string> = {};
    const g = paramToString(raw.guest);
    const d = isGuest ? paramToString(raw.displayName) : profile.displayName;
    if (g) p.guest = g;
    if (d) p.displayName = d;
    return p;
  }, [raw.guest, raw.displayName, isGuest, profile.displayName]);

  const styles = useMemo(
    () => createStyles(colors, profile.colorMode),
    [colors, profile.colorMode],
  );

  const tf = {
    labelColor: colors.muted,
    inputBackgroundColor: colors.surface,
    inputBorderColor: colors.border,
    inputTextColor: colors.text,
  };

  const tierSubs = useMemo(() => [u.shop.tier1Sub, u.shop.tier2Sub, u.shop.tier3Sub], [u]);

  const openBulkEmail = () => {
    const subject = encodeURIComponent(u.shop.bulkEmailSubject);
    const body = encodeURIComponent(
      `Company: ${bulkCompany || '—'}\nEstimated quantity: ${bulkQty || '—'}\n`,
    );
    Linking.openURL(`mailto:${SHOP_BULK_EMAIL}?subject=${subject}&body=${body}`);
  };

  const submitBulkForm = () => {
    if (!bulkEmail.trim()) {
      setBulkNotice({ kind: 'error', text: u.shop.bulkErrEmail });
      return;
    }
    setBulkNotice({
      kind: 'ok',
      text: u.shop.bulkOk,
    });
  };

  const onTabPress = (key: MainTabKey) => {
    if (key === 'home') {
      router.replace({ pathname: '/home', params: journeyParams });
      return;
    }
    if (key === 'cards') {
      router.push({ pathname: '/my-cards', params: journeyParams });
      return;
    }
    if (key === 'analytics') {
      router.replace({ pathname: '/analytics', params: journeyParams });
      return;
    }
    if (key === 'shop') {
      router.replace({ pathname: '/shop', params: journeyParams });
      return;
    }
    if (key === 'profile') {
      router.replace({ pathname: '/profile', params: journeyParams });
      return;
    }
  };

  const tabActive = (key: MainTabKey) => mainTabIsActive(pathname, segments, key);

  return (
    <SafeAreaView style={[styles.root, { paddingTop: insets.top }]} edges={['top']}>
      {isGuest ? (
        <View style={styles.guestRibbon}>
          <Text style={styles.guestRibbonText}>{u.common.guestRibbon}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>{u.shop.pageTitle}</Text>
          <Text style={styles.pageSub}>{u.shop.pageSub}</Text>
        </View>

        <Pressable
          onPress={() => router.push({ pathname: '/card-journey', params: journeyParams })}
          style={({ pressed }) => [
            styles.howItWorksCta,
            pressed && { opacity: 0.92 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={u.shop.howItWorksA11y}
        >
          <Ionicons name="sparkles-outline" size={20} color="#052e16" />
          <Text style={styles.howItWorksCtaText}>{u.shop.howItWorksCta}</Text>
        </Pressable>

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{u.shop.heroBadge}</Text>
          </View>
          <Text style={styles.heroTitle}>{u.shop.heroTitle}</Text>
          <Text style={styles.heroBody}>{u.shop.heroBody}</Text>
          <View style={styles.shipPill}>
            <Ionicons name="rocket-outline" size={18} color="#86efac" />
            <Text style={styles.shipPillText}>{u.shop.shipPill}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{u.shop.bundlesTitle}</Text>
        <Text style={styles.sectionHint}>{u.shop.bundlesHint}</Text>
        <View style={styles.tierRow}>
          {SHOP_TIERS.map((t) => {
            const on = selectedTierId === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => {
                  setSelectedTierId(t.id);
                  setCheckoutMessage(null);
                }}
                style={[
                  styles.tierCard,
                  on && {
                    borderColor: colors.accent,
                    backgroundColor: `${colors.accent}10`,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${t.qty} card bundle ${t.price} dollars`}
              >
                <Text style={styles.tierQty}>
                  {t.qty} {t.qty > 1 ? u.shop.cardPlural : u.shop.cardSingular}
                </Text>
                <Text style={styles.tierPrice}>${t.price}</Text>
                <Text style={styles.tierSub}>{tierSubs[t.id - 1]}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>{u.shop.businessBulkTitle}</Text>
        <Text style={styles.sectionHint}>{u.shop.businessBulkHint}</Text>
        <View style={styles.bulkCard}>
          <TextField
            label={u.shop.bulkCompanyLabel}
            value={bulkCompany}
            onChangeText={setBulkCompany}
            placeholder={u.shop.bulkPlaceholderCompany}
            containerStyle={styles.leadField}
            {...tf}
          />
          <TextField
            label={u.shop.bulkEmailLabel}
            value={bulkEmail}
            onChangeText={setBulkEmail}
            placeholder={u.shop.bulkPlaceholderEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.leadField}
            {...tf}
          />
          <TextField
            label={u.shop.bulkQtyLabel}
            value={bulkQty}
            onChangeText={setBulkQty}
            placeholder={u.shop.bulkPlaceholderQty}
            containerStyle={styles.leadField}
            {...tf}
          />
          <View style={styles.bulkActions}>
            <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]} onPress={submitBulkForm}>
              <Text style={styles.primaryBtnText}>{u.shop.requestEstimate}</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]} onPress={openBulkEmail}>
              <Text style={styles.secondaryBtnText}>{u.shop.emailInstead}</Text>
            </Pressable>
          </View>
          {bulkNotice ? (
            <Text
              style={[
                styles.inlineNotice,
                bulkNotice.kind === 'ok' ? styles.inlineNoticeOk : styles.inlineNoticeErr,
              ]}
            >
              {bulkNotice.text}
            </Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>{u.shop.shippingTitle}</Text>
        <Text style={styles.sectionHint}>{u.shop.shippingHint}</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={colors.accent} />
            <Text style={styles.infoText}>{u.shop.shippingInfo1}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="return-down-back-outline" size={20} color={colors.accent} />
            <Text style={styles.infoText}>{u.shop.shippingInfo2}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
            <Text style={styles.infoText}>{u.shop.shippingInfo3}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{u.shop.addOnsTitle}</Text>
        <Text style={styles.sectionHint}>{u.shop.addOnsHint}</Text>
        <View style={styles.addOnGrid}>
          <Pressable
            onPress={() => {
              setEngravingOn((v) => !v);
              setCheckoutMessage(null);
            }}
            style={({ pressed }) => [
              styles.addOn,
              engravingOn && styles.addOnActive,
              pressed && { opacity: 0.92 },
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: engravingOn }}
          >
            <View style={styles.addOnHead}>
              <Ionicons
                name={engravingOn ? 'checkbox' : 'square-outline'}
                size={22}
                color={engravingOn ? colors.accent : colors.muted}
              />
              <Text style={styles.addOnTitle}>{u.shop.laserEngraving}</Text>
            </View>
            <Text style={styles.addOnPrice}>{u.shop.laserEngravingPrice}</Text>
            <Text style={styles.addOnSub}>{u.shop.laserEngravingSub}</Text>
          </Pressable>
          <View style={[styles.addOn, stickerCount > 0 && styles.addOnActive]}>
            <Text style={styles.addOnTitle}>{u.shop.customStickers}</Text>
            <Text style={styles.addOnPrice}>{u.shop.stickersPrice}</Text>
            <Text style={styles.addOnSub}>{u.shop.stickersSub}</Text>
            <View style={styles.stepper}>
              <Pressable
                style={({ pressed }) => [styles.stepperBtn, pressed && { opacity: 0.8 }]}
                onPress={() => {
                  setStickerCount((c) => Math.max(0, c - 1));
                  setCheckoutMessage(null);
                }}
                accessibilityLabel={u.shop.fewerStickersA11y}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </Pressable>
              <Text style={styles.stepperValue}>{stickerCount}</Text>
              <Pressable
                style={({ pressed }) => [styles.stepperBtn, pressed && { opacity: 0.8 }]}
                onPress={() => {
                  setStickerCount((c) => Math.min(20, c + 1));
                  setCheckoutMessage(null);
                }}
                accessibilityLabel={u.shop.moreStickersA11y}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.giftWrapCard}>
          <Text style={styles.giftWrapTitle}>{u.shop.giftTitle}</Text>
          <Text style={styles.giftWrapBody}>{u.shop.giftBody}</Text>
          <Pressable
            style={styles.giftWrapToggle}
            onPress={() => {
              setGiftWrapOn((v) => !v);
              setCheckoutMessage(null);
            }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: giftWrapOn }}
          >
            <Ionicons
              name={giftWrapOn ? 'checkbox' : 'square-outline'}
              size={22}
              color={giftWrapOn ? colors.accent : colors.muted}
            />
            <Text style={styles.giftWrapToggleText}>{u.shop.giftWrapToggle}</Text>
          </Pressable>
        </View>

        <View style={styles.orderCard}>
          <Text style={styles.orderTitle}>{u.shop.orderTitle}</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderRowLabel}>
              {cart.tier.qty} NFC {cart.tier.qty > 1 ? u.shop.cardPlural : u.shop.cardSingular} (bundle)
            </Text>
            <Text style={styles.orderRowValue}>${cart.bundle}</Text>
          </View>
          {cart.engraving > 0 ? (
            <View style={styles.orderRow}>
              <Text style={styles.orderRowLabel}>
                {u.shop.orderEngraving} {cart.tier.qty}
              </Text>
              <Text style={styles.orderRowValue}>${cart.engraving}</Text>
            </View>
          ) : null}
          {cart.stickers > 0 ? (
            <View style={styles.orderRow}>
              <Text style={styles.orderRowLabel}>
                {u.shop.orderStickers} {stickerCount}
              </Text>
              <Text style={styles.orderRowValue}>${cart.stickers}</Text>
            </View>
          ) : null}
          {giftWrapOn ? (
            <View style={styles.orderRow}>
              <Text style={styles.orderRowLabel}>{u.shop.orderGiftWrap}</Text>
              <Text style={styles.orderRowValue}>$0</Text>
            </View>
          ) : null}
          <View style={styles.orderDivider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderTotalLabel}>{u.shop.estimatedTotal}</Text>
            <Text style={styles.orderTotalValue}>${cart.total}</Text>
          </View>
          <Text style={[styles.orderRowLabel, { marginTop: 2 }]}>{u.shop.freeShippingIncluded}</Text>
          <Pressable
            style={({ pressed }) => [styles.checkoutCta, pressed && { opacity: 0.92 }]}
            onPress={() => {
              void refreshMyCards();
              setCheckoutMessage(
                formatUiString(u.shop.orderQueued, {
                  qty: cart.tier.qty,
                  cards: cart.tier.qty > 1 ? u.shop.cardPlural : u.shop.cardSingular,
                  total: cart.total,
                }),
              );
            }}
            accessibilityRole="button"
            accessibilityLabel={u.shop.checkoutA11y}
          >
            <Text style={styles.checkoutCtaText}>{u.shop.checkoutCta}</Text>
          </Pressable>
          {checkoutMessage ? (
            <Text style={[styles.inlineNotice, styles.inlineNoticeOk]}>{checkoutMessage}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>{u.shop.giftCardsTitle}</Text>
        <Text style={styles.sectionHint}>{u.shop.giftCardsHint}</Text>
        <View style={styles.giftAmountRow}>
          {GIFT_AMOUNTS.map((amt) => {
            const on = selectedGift === amt;
            return (
              <Pressable
                key={amt}
                onPress={() => {
                  setSelectedGift(amt);
                  setGiftSelectionNote(null);
                }}
                style={[
                  styles.giftChip,
                  {
                    borderColor: on ? colors.accent : colors.border,
                    backgroundColor: on ? `${colors.accent}22` : colors.surface,
                  },
                ]}
              >
                <Text style={[styles.giftChipText, { color: on ? colors.accent : colors.text }]}>${amt}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
          onPress={() =>
            setGiftSelectionNote(
              formatUiString(u.shop.giftCardNote, {
                amount: selectedGift,
              }),
            )
          }
        >
          <Text style={styles.primaryBtnText}>
            {formatUiString(u.shop.buyGiftCard, { amount: selectedGift })}
          </Text>
        </Pressable>
        {giftSelectionNote ? (
          <Text style={[styles.inlineNotice, styles.inlineNoticeOk]}>{giftSelectionNote}</Text>
        ) : null}

        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>{u.shop.reviewsTitle}</Text>
        <Text style={styles.sectionHint}>{u.shop.reviewsHint}</Text>
        {MOCK_SHOP_REVIEWS.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewName}>{r.name}</Text>
              <Text style={styles.reviewDate}>{r.dateLabel}</Text>
            </View>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons key={i} name="star" size={16} color={STAR} />
              ))}
            </View>
            <Text style={styles.reviewTitle}>{r.title}</Text>
            <Text style={styles.reviewBody}>{r.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {(
          [
            { icon: 'home-outline' as const, key: 'home' as const },
            { icon: 'card-outline' as const, key: 'cards' as const },
            { icon: 'stats-chart-outline' as const, key: 'analytics' as const },
            { icon: 'bag-outline' as const, key: 'shop' as const },
            { icon: 'person-outline' as const, key: 'profile' as const },
          ] as const
        ).map((tab) => {
          const active = tabActive(tab.key);
          return (
            <Pressable key={tab.key} style={styles.tabItem} onPress={() => onTabPress(tab.key)}>
              <Ionicons name={tab.icon} size={22} color={active ? colors.text : colors.muted} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{u.nav[tab.key]}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
