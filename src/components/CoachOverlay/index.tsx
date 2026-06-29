import React from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";
import { useCoach } from "@/context/CoachContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useStyles } from "./styles";

const PADDING = 8; // respiro ao redor do alvo destacado
const BALLOON_WIDTH = 280;

export function CoachOverlay() {
  const { active, step, targetRect, stepIndex, totalSteps, next, prev, stop } =
    useCoach();
  const styles = useStyles();
  const { colors } = useAppTheme();

  if (!active || !step) return null;

  const { width: screenW, height: screenH } = Dimensions.get("window");

  // Retângulo do furo (com respiro). Se ainda não mediu, fica vazio (só escurece).
  const hole = targetRect
    ? {
        x: Math.max(targetRect.x - PADDING, 0),
        y: Math.max(targetRect.y, 0),
        width: targetRect.width + PADDING * 2,
        height: targetRect.height + PADDING * 2,
      }
    : null;

  // Decide se o balão fica acima ou abaixo do alvo.
  const showBelow = !targetRect || targetRect.y < screenH * 0.45;

  const balloonTop = hole
    ? showBelow
      ? hole.y + hole.height + 14
      : Math.max(hole.y - 190, 40)
    : screenH / 2 - 90;

  // Balão sempre centralizado horizontalmente na tela (evita grudar na borda
  // quando o alvo está num canto, como a foto de perfil).
  const balloonLeft = screenW / 2 - BALLOON_WIDTH / 2;

  const isLast = stepIndex === totalSteps - 1;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Camada escura com furo no alvo (toque na área escura avança) */}
      <Pressable style={styles.dimPressable} onPress={next}>
        <Svg width={screenW} height={screenH}>
          <Defs>
            <Mask id="coach-mask">
              <Rect x={0} y={0} width={screenW} height={screenH} fill="white" />
              {hole && (
                <Rect
                  x={hole.x}
                  y={hole.y}
                  width={hole.width}
                  height={hole.height}
                  rx={14}
                  ry={14}
                  fill="black"
                />
              )}
            </Mask>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={screenW}
            height={screenH}
            fill="rgba(0,0,0,0.78)"
            mask="url(#coach-mask)"
          />
        </Svg>
      </Pressable>

      {/* Borda destacando o alvo */}
      {hole && (
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              left: hole.x,
              top: hole.y,
              width: hole.width,
              height: hole.height,
            },
          ]}
        />
      )}

      {/* Balão */}
      <View
        style={[
          styles.balloon,
          { top: balloonTop, left: balloonLeft, width: BALLOON_WIDTH },
        ]}
      >
        <Text style={styles.stepCounter}>
          {stepIndex + 1} de {totalSteps}
        </Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.text}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={stop} hitSlop={10}>
            <Text style={styles.skip}>Pular</Text>
          </TouchableOpacity>

          <View style={styles.rightActions}>
            {stepIndex > 0 && (
              <TouchableOpacity onPress={prev} hitSlop={10}>
                <Text style={styles.prev}>Anterior</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={next}
              style={styles.nextButton}
              activeOpacity={0.85}
            >
              <Text style={[styles.nextLabel, { color: colors.white }]}>
                {isLast ? "Concluir" : "Próximo"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
