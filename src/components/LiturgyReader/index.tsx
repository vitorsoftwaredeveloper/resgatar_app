import { CoachTarget } from "@/components/CoachTarget";
import { useAppTheme } from "@/context/ThemeContext";
import { TTSState } from "@/hooks/useLiturgyTTS";
import { ChevronDown, Pause, Play } from "lucide-react-native";
import React, { Fragment, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "./styles";

// Leitor de liturgia por abas — portado do DesktopLiturgyReader do
// resgatar-browser. No mobile as abas não cabem numa linha, então (como no
// browser) colapsam num seletor tipo dropdown; o texto completo da leitura
// escolhida aparece de imediato, sem "ver mais".

export interface LiturgySection {
  id: string;
  label: string;
  referencia: string;
  titulo?: string;
  refrao?: string;
  texto: string;
  formulaFinal?: string;
  ttsText: string;
}

interface Props {
  sections: LiturgySection[];
  activeId: string;
  onSelectSection: (id: string) => void;
  getTTS: (
    id: string,
    text: string,
  ) => {
    ttsState: TTSState;
    onTTSPlay: () => void;
    onTTSPause: () => void;
  };
  coachId?: string;
}

// Destaca o número do versículo (dígitos seguidos de letra/aspa) como no
// browser: número em fonte menor e cor de acento.
function formatVerseText(text: string, verseStyle: any) {
  const parts = text.split(/(\d+)(?=[A-Za-zÀ-ÿ"'“”‘’«»])/);
  return parts.map((part, i) =>
    /^\d+$/.test(part) ? (
      <Text key={i} style={verseStyle}>
        {part}{" "}
      </Text>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function LiturgyReader({
  sections,
  activeId,
  onSelectSection,
  getTTS,
  coachId,
}: Props) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Preserva a aba ao trocar de data; se a seção não existir nesse dia
  // (ex.: Segunda Leitura só aos domingos), cai na primeira disponível.
  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  if (!active) return null;

  const tts = getTTS(active.id, active.ttsText);

  return (
    <View style={styles.panel}>
      <View style={styles.tabsWrap}>
        <Pressable
          style={styles.selectTrigger}
          onPress={() => setMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Escolher leitura"
        >
          <Text style={styles.selectLabel}>{active.label}</Text>
          <ChevronDown size={18} color={colors.primary} />
        </Pressable>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <View style={styles.selectList}>
            {sections.map((section) => {
              const selected = section.id === active.id;
              return (
                <TouchableOpacity
                  key={section.id}
                  style={[
                    styles.selectOption,
                    selected && styles.selectOptionActive,
                  ]}
                  onPress={() => {
                    onSelectSection(section.id);
                    setMenuOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      selected && styles.selectOptionTextActive,
                    ]}
                  >
                    {section.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.reading}>
        <View style={styles.readingHeader}>
          <View style={styles.readingHeadings}>
            <Text style={styles.readingLabel}>
              {active.label.toUpperCase()}
            </Text>
            {!!active.referencia && (
              <Text style={styles.referencia}>{active.referencia}</Text>
            )}
            {!!active.titulo && (
              <Text style={styles.titulo}>{active.titulo}</Text>
            )}
          </View>

          <CoachTarget id={coachId ?? "reading-tts-btn-unused"}>
            <TouchableOpacity
              onPress={() =>
                tts.ttsState === "playing" ? tts.onTTSPause() : tts.onTTSPlay()
              }
              style={[
                styles.ttsBtn,
                tts.ttsState === "playing" && styles.ttsBtnActive,
              ]}
              accessibilityLabel={
                tts.ttsState === "playing" ? "Pausar leitura" : "Ouvir leitura"
              }
              disabled={tts.ttsState === "loading"}
            >
              {tts.ttsState === "playing" ? (
                <Pause size={20} color={colors.primary} fill={colors.primary} />
              ) : (
                <Play size={20} color={colors.primary} fill={colors.primary} />
              )}
            </TouchableOpacity>
          </CoachTarget>
        </View>

        <View style={styles.hairline} />

        {!!active.refrao && (
          <View style={styles.refraoBlock}>
            <Text style={styles.refraoText}>{active.refrao}</Text>
          </View>
        )}

        <Text style={styles.texto}>
          {formatVerseText(active.texto, styles.verseNumber)}
        </Text>
        {!!active.formulaFinal && (
          <Text style={styles.formulaFinal}>{`— ${active.formulaFinal}`}</Text>
        )}
      </View>
    </View>
  );
}
