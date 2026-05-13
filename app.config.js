/** Expo app config (client-only build — no API host). */
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...(config.android || {}),
    usesCleartextTraffic: true,
  },
  ios: {
    ...(config.ios || {}),
    infoPlist: {
      ...(config.ios?.infoPlist || {}),
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
        NSAllowsArbitraryLoads: true,
      },
      NSLocalNetworkUsageDescription:
        'Used on local networks when you open links or optional dev tooling.',
    },
  },
});
