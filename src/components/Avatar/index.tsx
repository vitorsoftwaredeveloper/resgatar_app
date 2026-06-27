import { useAppTheme } from "@/context/ThemeContext";
import { FRAME_TIERS, FrameEffect } from "@/services/BadgeService";
import { resolveAvatarUri } from "@/utils/image";
import { Camera, UserRound } from "lucide-react-native";
import React, { useEffect, useId } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { useStyles } from "./styles";

interface AvatarProps {
  photo?: string | null;
  /** Diâmetro da FOTO. A moldura/efeito são desenhados por fora, sem encolhê-la. */
  size?: number;
  onPress?: () => void;
  /** Mostra um selo de câmera indicando que a foto é editável. */
  editable?: boolean;
  /**
   * Índice em FRAME_TIERS. Quando > 0, desenha a "moldura da caminhada" ao
   * redor da foto. 0 (ou ausente) renderiza o avatar simples de sempre — assim
   * todo uso existente (incl. fotos de outros membros) segue inalterado.
   */
  tier?: number;
  /** Efeito cosmético ao redor do avatar (categoria separada da moldura). */
  effect?: FrameEffect;
}

// Camada sobreposta e centralizada (efeito ou anel) sobre a foto.
function Layer({ children }: { children: React.ReactNode }) {
  return (
    <View style={[StyleSheet.absoluteFill, styles_center]} pointerEvents="none">
      {children}
    </View>
  );
}
const styles_center = { alignItems: "center", justifyContent: "center" } as const;

export function Avatar({
  photo,
  size = 56,
  onPress,
  editable,
  tier = 0,
  effect = "none",
}: AvatarProps) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  const gradientId = useId();
  const glowId = useId();

  const frame = FRAME_TIERS[tier] ?? FRAME_TIERS[0];
  const hasRing = frame.ringColors.length > 0;
  const accent = frame.ringColors[frame.ringColors.length - 1] ?? colors.primary;

  // Geometria em camadas concêntricas: foto → anel → efeito.
  const gap = 2;
  const photoR = size / 2;
  const ringBand = hasRing ? frame.ringWidth + gap : 0;
  const ringOuterR = photoR + ringBand;
  const dotD = Math.max(6, Math.round(size * 0.16));

  const spins = effect === "rotate" || effect === "orbit" ||
    effect === "dual-orbit" || effect === "dashed";
  const pulses = effect === "pulse" || effect === "ripple";
  const orbits = effect === "orbit" || effect === "dual-orbit";

  const effectPad =
    effect === "glow"
      ? Math.round(size * 0.18)
      : pulses
        ? Math.round(size * 0.14)
        : orbits
          ? dotD / 2 + 2
          : effect === "dashed"
            ? Math.round(size * 0.12)
            : effect === "breathe"
              ? Math.round(size * 0.05)
              : 0;

  const totalR = ringOuterR + effectPad;
  const total = totalR * 2;
  const ringSvg = ringOuterR * 2;

  const uri = resolveAvatarUri(photo);
  const photoCircle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  // Um valor de giro serve rotate/orbit/dual-orbit/dashed; pulse/ripple usam a
  // onda (pulse + pulse2 defasada); breathe escala o avatar inteiro.
  const spin = useSharedValue(0);
  const pulse = useSharedValue(0);
  const pulse2 = useSharedValue(0);
  const breathe = useSharedValue(0);
  useEffect(() => {
    if (spins) {
      spin.value = 0;
      spin.value = withRepeat(
        withTiming(360, { duration: 6000, easing: Easing.linear }),
        -1,
      );
    }
    if (pulses) {
      pulse.value = 0;
      pulse.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }),
        -1,
      );
    }
    if (effect === "ripple") {
      pulse2.value = 0;
      pulse2.value = withDelay(
        900,
        withRepeat(
          withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }),
          -1,
        ),
      );
    }
    if (effect === "breathe") {
      breathe.value = 0;
      breathe.value = withRepeat(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    }
  }, [effect, spins, pulses, spin, pulse, pulse2, breathe]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.4 }],
    opacity: 0.5 * (1 - pulse.value),
  }));
  const pulse2Style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse2.value * 0.4 }],
    opacity: 0.5 * (1 - pulse2.value),
  }));
  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.06 }],
  }));

  const sonarRing = (animStyle: typeof pulseStyle) => (
    <Animated.View
      style={[
        {
          width: ringOuterR * 2,
          height: ringOuterR * 2,
          borderRadius: ringOuterR,
          borderWidth: 2,
          borderColor: accent,
        },
        animStyle,
      ]}
    />
  );
  const dot = (
    <View
      style={{
        width: dotD,
        height: dotD,
        borderRadius: dotD / 2,
        backgroundColor: accent,
      }}
    />
  );

  const photoContent = uri ? (
    <Image source={{ uri }} style={[styles.image, photoCircle]} />
  ) : (
    <UserRound size={size * 0.45} color={colors.primary} />
  );

  const ring = hasRing ? (
    <Layer>
      <Animated.View style={effect === "rotate" && spinStyle}>
        <Svg width={ringSvg} height={ringSvg}>
          {frame.ringColors.length > 1 && (
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                {frame.ringColors.map((color, i) => (
                  <Stop
                    key={i}
                    offset={i / (frame.ringColors.length - 1)}
                    stopColor={color}
                  />
                ))}
              </LinearGradient>
            </Defs>
          )}
          <Circle
            cx={ringSvg / 2}
            cy={ringSvg / 2}
            r={ringSvg / 2 - frame.ringWidth / 2}
            fill="none"
            stroke={
              frame.ringColors.length > 1
                ? `url(#${gradientId})`
                : frame.ringColors[0]
            }
            strokeWidth={frame.ringWidth}
          />
        </Svg>
      </Animated.View>
    </Layer>
  ) : null;

  // Halo suave (gradiente radial) na faixa externa, sem cobrir a foto.
  const glow =
    effect === "glow" ? (
      <Layer>
        <Svg width={total} height={total}>
          <Defs>
            <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
              <Stop offset={ringOuterR / totalR} stopColor={accent} stopOpacity={0} />
              <Stop
                offset={(ringOuterR + effectPad * 0.4) / totalR}
                stopColor={accent}
                stopOpacity={0.45}
              />
              <Stop offset={1} stopColor={accent} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={total / 2} cy={total / 2} r={totalR} fill={`url(#${glowId})`} />
        </Svg>
      </Layer>
    ) : null;

  // Anel(éis) "sonar" que expandem e somem em loop (pulse = 1, ripple = 2).
  const pulseNode = pulses ? (
    <Layer>{sonarRing(pulseStyle)}</Layer>
  ) : null;
  const rippleNode =
    effect === "ripple" ? <Layer>{sonarRing(pulse2Style)}</Layer> : null;

  // Ponto(s) que orbitam (container do tamanho total gira no próprio centro).
  const orbit =
    effect === "orbit" ? (
      <Layer>
        <Animated.View
          style={[{ width: total, height: total, alignItems: "center" }, spinStyle]}
        >
          {dot}
        </Animated.View>
      </Layer>
    ) : null;
  const dualOrbit =
    effect === "dual-orbit" ? (
      <Layer>
        <Animated.View
          style={[
            {
              width: total,
              height: total,
              alignItems: "center",
              justifyContent: "space-between",
            },
            spinStyle,
          ]}
        >
          {dot}
          {dot}
        </Animated.View>
      </Layer>
    ) : null;

  // Anel tracejado girando, por fora da moldura.
  const dashed =
    effect === "dashed" ? (
      <Layer>
        <Animated.View style={spinStyle}>
          <Svg width={total} height={total}>
            <Circle
              cx={total / 2}
              cy={total / 2}
              r={totalR - 1.5}
              fill="none"
              stroke={accent}
              strokeWidth={3}
              strokeDasharray="6 7"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
      </Layer>
    ) : null;

  const content = (
    <Animated.View
      style={[
        { width: total, height: total, ...styles_center },
        effect === "breathe" && breatheStyle,
      ]}
    >
      {glow}
      {pulseNode}
      {rippleNode}
      {orbit}
      {dualOrbit}
      {dashed}
      {ring}
      <View style={[styles.circle, photoCircle]}>{photoContent}</View>

      {editable && (
        <View style={styles.badge}>
          <Camera size={14} color={colors.white} />
        </View>
      )}
    </Animated.View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {content}
    </TouchableOpacity>
  );
}
