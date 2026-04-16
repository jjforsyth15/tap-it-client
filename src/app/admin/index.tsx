import { Screen } from '@/src/components/Screen';
import {
  mockAnalytics,
  mockCustomers,
  mockOrdersToFulfill,
  mockOrdersToShip,
  type AdminCustomer,
  type AdminOrder,
} from '@/src/constants/mockAdminData';
import { clearAdminSession, hasAdminSession } from '@/src/features/admin/adminSession';
import { T } from '@/src/features/tapitOnboarding/theme';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type TabId = 'fulfill' | 'ship' | 'customers' | 'analytics';

export default function AdminDashboardScreen() {
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<TabId>('fulfill');

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const ok = await hasAdminSession();
        if (cancelled) return;
        if (!ok) {
          router.replace('/admin/login');
          return;
        }
        setChecking(false);
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const logout = async () => {
    await clearAdminSession();
    router.replace('/admin/login');
  };

  if (checking) {
    return (
      <Screen style={styles.centered}>
        <ActivityIndicator color={T.text} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerKicker}>Operations</Text>
          <Text style={styles.headerTitle}>Admin</Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutBtn} hitSlop={8}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        <View style={styles.tabsRow}>
          <TabChip label="To fulfill" active={tab === 'fulfill'} onPress={() => setTab('fulfill')} />
          <TabChip label="To ship" active={tab === 'ship'} onPress={() => setTab('ship')} />
          <TabChip label="Customers" active={tab === 'customers'} onPress={() => setTab('customers')} />
          <TabChip label="Analytics" active={tab === 'analytics'} onPress={() => setTab('analytics')} />
        </View>
      </ScrollView>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {tab === 'fulfill' && (
          <>
            <SectionTitle title="Recent orders — fulfill" subtitle="Pack and prep these first" />
            {mockOrdersToFulfill.map((o) => (
              <OrderCard key={o.id} order={o} accent="#fbbf24" />
            ))}
          </>
        )}
        {tab === 'ship' && (
          <>
            <SectionTitle title="Ready to ship" subtitle="Labels and carrier handoff" />
            {mockOrdersToShip.map((o) => (
              <OrderCard key={o.id} order={o} accent="#38bdf8" />
            ))}
          </>
        )}
        {tab === 'customers' && (
          <>
            <SectionTitle title="Customers" subtitle="Recent activity (mock data)" />
            {mockCustomers.map((c) => (
              <CustomerCard key={c.id} customer={c} />
            ))}
          </>
        )}
        {tab === 'analytics' && (
          <>
            <SectionTitle title="Snapshot" subtitle="Last 7 days — UI placeholder" />
            <View style={styles.statGrid}>
              <StatCard label="Revenue" value={mockAnalytics.revenue7d} />
              <StatCard label="Orders" value={String(mockAnalytics.orders7d)} />
              <StatCard label="Avg order" value={mockAnalytics.avgOrder} />
              <StatCard label="New customers" value={String(mockAnalytics.newCustomers)} />
            </View>
            <View style={styles.queueRow}>
              <QueuePill label="Fulfill queue" value={mockAnalytics.fulfillQueue} color="#fbbf24" />
              <QueuePill label="Ship queue" value={mockAnalytics.shipQueue} color="#38bdf8" />
            </View>
            <Text style={styles.analyticsNote}>
              Wire this tab to your backend for real revenue, conversion, and fulfillment SLA charts.
            </Text>
          </>
        )}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </Screen>
  );
}

function TabChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabChip, active && styles.tabChipActive]}
    >
      <Text style={[styles.tabChipText, active && styles.tabChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function OrderCard({ order, accent }: { order: AdminOrder; accent: string }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardAccent, { backgroundColor: accent }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderTotal}>{order.total}</Text>
        </View>
        <Text style={styles.customerName}>{order.customer}</Text>
        <Text style={styles.customerEmail}>{order.email}</Text>
        <Text style={styles.orderItems}>{order.items}</Text>
        <Text style={styles.orderMeta}>{order.placedAt}</Text>
      </View>
    </View>
  );
}

function CustomerCard({ customer }: { customer: AdminCustomer }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardAccent, { backgroundColor: T.green }]} />
      <View style={styles.cardBody}>
        <Text style={styles.custId}>{customer.id}</Text>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerEmail}>{customer.email}</Text>
        <View style={styles.custRow}>
          <Text style={styles.custMeta}>{customer.orders} orders</Text>
          <Text style={styles.custMeta}>·</Text>
          <Text style={styles.custMeta}>{customer.spent} lifetime</Text>
        </View>
        <Text style={styles.orderMeta}>Last order {customer.lastOrder}</Text>
      </View>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function QueuePill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.queuePill, { borderColor: color }]}>
      <Text style={styles.queuePillLabel}>{label}</Text>
      <Text style={[styles.queuePillValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 20, paddingVertical: 16 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerKicker: { fontSize: 12, fontWeight: '600', color: T.mutedCaps, textTransform: 'uppercase' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: T.text },
  logoutBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#a78bfa' },
  tabsScroll: { marginBottom: 12, marginHorizontal: -4 },
  tabsRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  tabChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  tabChipActive: {
    backgroundColor: T.surfaceElevated,
    borderColor: '#6366f1',
  },
  tabChipText: { fontSize: 14, fontWeight: '600', color: T.muted },
  tabChipTextActive: { color: T.text },
  body: { flex: 1 },
  bodyContent: { paddingBottom: 32 },
  sectionHeader: { marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  sectionSubtitle: { fontSize: 14, color: T.muted, marginTop: 4 },
  card: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  orderId: { fontSize: 13, fontWeight: '700', color: '#a78bfa' },
  orderTotal: { fontSize: 15, fontWeight: '700', color: T.text },
  customerName: { fontSize: 16, fontWeight: '600', color: T.text },
  customerEmail: { fontSize: 14, color: T.muted, marginTop: 2 },
  orderItems: { fontSize: 14, color: '#d4d4d8', marginTop: 8, lineHeight: 20 },
  orderMeta: { fontSize: 12, color: T.mutedCaps, marginTop: 10 },
  custId: { fontSize: 12, fontWeight: '700', color: T.muted, marginBottom: 4 },
  custRow: { flexDirection: 'row', gap: 6, marginTop: 8, alignItems: 'center' },
  custMeta: { fontSize: 13, color: T.muted },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
  },
  statLabel: { fontSize: 12, fontWeight: '600', color: T.muted, textTransform: 'uppercase' },
  statValue: { fontSize: 22, fontWeight: '800', color: T.text, marginTop: 6 },
  queueRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  queuePill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    backgroundColor: T.surface,
  },
  queuePillLabel: { fontSize: 13, color: T.muted, fontWeight: '600' },
  queuePillValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  analyticsNote: {
    fontSize: 13,
    color: T.muted,
    marginTop: 20,
    lineHeight: 19,
  },
  footerSpacer: { height: 8 },
});
