/**
 * Dynamic Expo config: passes EXPO_PUBLIC_API_BASE_URL into `extra` when set.
 * Default API host is https://tap-it-server.onrender.com (see src/config/api.ts).
 */
module.exports = ({ config }) => {
  const trimmed = (process.env.EXPO_PUBLIC_API_BASE_URL || '').trim().replace(/\/$/, '');

  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      ...(trimmed ? { apiBaseUrl: trimmed } : {}),
    },
    android: {
      ...(config.android || {}),
      // Allow http:// to your LAN IP / emulator (Android blocks cleartext by default)
      usesCleartextTraffic: true,
    },
    ios: {
      ...(config.ios || {}),
      infoPlist: {
        ...(config.ios?.infoPlist || {}),
        // Physical devices: HTTP to a LAN IP (e.g. http://192.168.x.x:8000) is blocked by ATS unless relaxed.
        // NSAllowsLocalNetworking alone is not always enough for plain http:// + IP; allow dev HTTP.
        NSAppTransportSecurity: {
          NSAllowsLocalNetworking: true,
          NSAllowsArbitraryLoads: true,
        },
        NSLocalNetworkUsageDescription:
          'Tapit connects to your development server on the local network to sign you in.',
      },
    },
  };
};
