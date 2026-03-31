import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

type BackgroundLandingPageProps = {
  children?: React.ReactNode;
};

type LineConfig = {
  left: `${number}%`;
  duration: number;
  delay: number;
};

const LINE_CONFIGS: LineConfig[] = [
  { left: '5%', duration: 7000, delay: 0 },
  { left: '12%', duration: 9000, delay: 1000 },
  { left: '18%', duration: 6000, delay: 2000 },
  { left: '25%', duration: 8000, delay: 500 },
  { left: '33%', duration: 10000, delay: 1500 },
  { left: '40%', duration: 7500, delay: 3000 },
  { left: '48%', duration: 6500, delay: 1000 },
  { left: '56%', duration: 8500, delay: 2500 },
  { left: '64%', duration: 9500, delay: 800 },
  { left: '72%', duration: 7200, delay: 2200 },
  { left: '80%', duration: 11000, delay: 1200 },
  { left: '88%', duration: 8000, delay: 3200 },
  { left: '95%', duration: 6800, delay: 300 },
];

export function BackgroundLandingPage({ children }: BackgroundLandingPageProps) {
  const { height } = Dimensions.get('window');
  const lineAnims = useRef(LINE_CONFIGS.map(() => new Animated.Value(0))).current;
  const glow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const lineLoops = lineAnims.map((anim, i) => {
      const run = Animated.loop(
        Animated.sequence([
          Animated.delay(LINE_CONFIGS[i].delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: LINE_CONFIGS[i].duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      run.start();
      return run;
    });

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.8,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.6,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();

    return () => {
      lineLoops.forEach((loop) => loop.stop());
      glowLoop.stop();
    };
  }, [glow, lineAnims]);

  const lineTransforms = useMemo(
    () =>
      lineAnims.map((anim) => ({
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -height * 1.2],
        }),
        opacity: anim.interpolate({
          inputRange: [0, 0.15, 0.8, 1],
          outputRange: [0, 0.5, 0.3, 0],
        }),
      })),
    [height, lineAnims]
  );

  return (
    <View style={styles.container}>
      <View style={styles.baseBackground} />

      <Animated.View style={[styles.glow, { opacity: glow }]} />

      {LINE_CONFIGS.map((line, i) => (
        <Animated.View
          key={`${line.left}-${line.duration}`}
          style={[
            styles.line,
            { left: line.left },
            {
              transform: [{ translateY: lineTransforms[i].translateY }],
              opacity: lineTransforms[i].opacity,
            },
          ]}
        />
      ))}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#010409',
    overflow: 'hidden',
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020817',
  },
  glow: {
    position: 'absolute',
    top: '22%',
    left: '10%',
    width: '80%',
    height: '55%',
    borderRadius: 999,
    backgroundColor: 'rgba(80, 140, 220, 0.12)',
  },
  line: {
    position: 'absolute',
    bottom: -150,
    width: 1.5,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(120, 180, 255, 0.45)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
});
