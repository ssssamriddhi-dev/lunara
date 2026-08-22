import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';

const AG = Animated.createAnimatedComponent(G);
let W = '#FFFFFF';

function Star({ x, y, s = 4, o = 0.9 }) {
  return (
    <G opacity={o}>
      <Path d={`M${x} ${y - s} L${x} ${y + s} M${x - s} ${y} L${x + s} ${y}`} stroke={W} strokeWidth="1" strokeLinecap="round" />
      <Path d={`M${x - s * 0.6} ${y - s * 0.6} L${x + s * 0.6} ${y + s * 0.6} M${x + s * 0.6} ${y - s * 0.6} L${x - s * 0.6} ${y + s * 0.6}`} stroke={W} strokeWidth="0.7" strokeLinecap="round" opacity={0.7} />
    </G>
  );
}

export default function WombLine({ size = 300, animate = true, tint = '#FFFFFF', style }) {
  W = tint;
  const glow = useRef(new Animated.Value(0.5)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    const loop = (v, hi, lo, ms) =>
      Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: hi, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: lo, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    loop(glow, 1, 0.35, 2200);
    loop(drift, 1, 0, 4200);
  }, [animate]);

  const scale = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });

  return (
    <View style={style} pointerEvents="none">
      <Animated.View style={{ transform: [{ scale }] }}>
        <Svg width={size} height={size * 1.18} viewBox="0 0 260 306">

          <AG opacity={glow}>
            <Circle cx="130" cy="30" r="11" fill={W} opacity={0.55} />
            <Circle cx="130" cy="30" r="7" fill={W} opacity={0.9} />
            <Path d="M130 12 L130 6 M116 18 L112 13 M144 18 L148 13 M110 30 L104 30 M150 30 L156 30"
              stroke={W} strokeWidth="1.1" strokeLinecap="round" />
            <Path d="M96 40 A9 9 0 0 0 96 58 A5.5 9 0 0 1 96 40" fill={W} opacity={0.85} />
            <Path d="M164 40 A9 9 0 0 1 164 58 A5.5 9 0 0 0 164 40" fill={W} opacity={0.85} />
          </AG>

          <G>
            <Star x={78} y={62} s={4} o={0.8} />
            <Star x={182} y={62} s={4} o={0.8} />
            <Star x={64} y={92} s={3} o={0.6} />
            <Star x={196} y={92} s={3} o={0.6} />
            <Star x={88} y={112} s={2.5} o={0.5} />
            <Star x={172} y={112} s={2.5} o={0.5} />
            <Star x={58} y={128} s={2} o={0.45} />
            <Star x={202} y={128} s={2} o={0.45} />
          </G>

          <Circle cx="130" cy="128" r="52" fill={W} opacity={0.22} />
          <Circle cx="130" cy="128" r="52" stroke={W} strokeWidth="1" fill="none" opacity={0.5} />

          <G stroke={W} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M96 152 C92 176, 106 196, 116 214 C122 224, 126 236, 130 248 C134 236, 138 224, 144 214 C154 196, 168 176, 164 152 C152 144, 108 144, 96 152 Z" />
            <Path d="M96 154 C74 140, 56 138, 44 150 C36 159, 40 172, 52 174 C64 176, 72 168, 70 158" />
            <Path d="M164 154 C186 140, 204 138, 216 150 C224 159, 220 172, 208 174 C196 176, 188 168, 190 158" />
            <Path d="M70 158 C82 150, 90 150, 96 154" />
            <Path d="M190 158 C178 150, 170 150, 164 154" />
          </G>

          <G stroke={W} strokeWidth="1.4" fill="none" strokeLinecap="round">
            <Path d="M52 168 C44 172, 38 180, 40 190 C42 198, 52 200, 58 194 C64 188, 62 176, 52 168 Z" />
            <Path d="M208 168 C216 172, 222 180, 220 190 C218 198, 208 200, 202 194 C196 188, 198 176, 208 168 Z" />
            <Path d="M46 178 L54 186 M50 174 L58 182 M44 184 L50 190" strokeWidth="0.9" opacity={0.8} />
            <Path d="M214 178 L206 186 M210 174 L202 182 M216 184 L210 190" strokeWidth="0.9" opacity={0.8} />
          </G>

          <G stroke={W} strokeWidth="1.6" fill="none" strokeLinecap="round">
            <Path d="M130 168 C124 152, 118 140, 112 132 C118 138, 124 146, 130 156" />
            <Path d="M130 168 C136 152, 142 140, 148 132 C142 138, 136 146, 130 156" />
            <Path d="M130 156 C130 140, 130 126, 130 112 C126 122, 124 136, 126 150" />
            <Path d="M130 112 C134 122, 136 136, 134 150" />
            <Path d="M122 160 C110 154, 100 148, 94 140 C104 146, 116 152, 124 158" />
            <Path d="M138 160 C150 154, 160 148, 166 140 C156 146, 144 152, 136 158" />
            <Ellipse cx="130" cy="178" rx="5" ry="10" />
          </G>

          <G stroke={W} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <Path d="M126 250 C108 246, 90 250, 76 262 C92 258, 110 258, 124 262" />
            <Path d="M134 250 C152 246, 170 250, 184 262 C168 258, 150 258, 136 262" />
            <Path d="M124 258 C110 260, 98 268, 92 278 C104 270, 116 266, 126 266" />
            <Path d="M136 258 C150 260, 162 268, 168 278 C156 270, 144 266, 134 266" />
          </G>

          <G stroke={W} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity={0.85}>
            <Path d="M130 266 C130 278, 128 290, 122 300" />
            <Path d="M130 268 C122 274, 112 282, 106 294" />
            <Path d="M130 268 C138 274, 148 282, 154 294" />
            <Path d="M130 270 C130 282, 132 292, 136 302" />
            <Path d="M126 276 C116 282, 108 290, 104 300" />
            <Circle cx="122" cy="303" r="1.6" fill={W} />
            <Circle cx="136" cy="304" r="1.6" fill={W} />
            <Circle cx="106" cy="296" r="1.4" fill={W} />
            <Circle cx="154" cy="296" r="1.4" fill={W} />
          </G>

        </Svg>
      </Animated.View>
    </View>
  );
}
