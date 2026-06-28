import { Avatar } from "@/components/Avatar";
import { useAppTheme } from "@/context/ThemeContext";
import {
  EFFECTS,
  evaluateBadges,
  FRAME_TIERS,
  resolveFrameIndex,
  unlockedBadgeIds,
} from "@/services/BadgeService";
import { emptyStreak, GRACE_MAX } from "@/services/StreakService";
import { IStreakData } from "@/storage/asyncStorage";
import { STREAK_ACCENT } from "@/components/StreakCard/styles";
import { badgeIcon } from "./badgeIcons";
import { Check, Flame, Lock, ShieldCheck } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./styles";

interface Props {
  visible: boolean;
  data: IStreakData | null;
  onClose: () => void;
  /** Moldura escolhida pelo membro (null = automática, a maior desbloqueada). */
  selectedFrame?: string | null;
  /** Quando definido, habilita a seção de escolha de moldura. */
  onSelectFrame?: (frameId: string | null) => void;
  /** Efeito escolhido pelo membro (null = nenhum). */
  selectedEffect?: string | null;
  /** Quando definido, habilita a seção de escolha de efeito. */
  onSelectEffect?: (effectId: string | null) => void;
}

const EMPTY: IStreakData = emptyStreak();

export function AchievementsModal({
  visible,
  data,
  onClose,
  selectedFrame = null,
  onSelectFrame,
  selectedEffect = null,
  onSelectEffect,
}: Props) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const streak = data ?? EMPTY;

  type Tab = "conquistas" | "molduras" | "efeitos";
  const [tab, setTab] = useState<Tab>("conquistas");

  // Sempre reabre na aba leve (Conquistas), evitando carregar Avatares à toa.
  useEffect(() => {
    if (!visible) setTab("conquistas");
  }, [visible]);

  const badges = useMemo(() => evaluateBadges(streak), [streak]);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const badgeCount = useMemo(() => unlockedBadgeIds(streak).length, [streak]);
  // Moldura efetivamente exibida hoje, para destacar na lista.
  const shownFrame = useMemo(
    () => resolveFrameIndex(streak, selectedFrame),
    [streak, selectedFrame],
  );

  // Monta o conteúdo só quando aberta — evita o custo das seções em segundo plano.
  if (!visible) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "conquistas", label: "Conquistas" },
    ...(onSelectFrame ? [{ key: "molduras" as Tab, label: "Molduras" }] : []),
    ...(onSelectEffect ? [{ key: "efeitos" as Tab, label: "Efeitos" }] : []),
  ];

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Flame size={16} color={STREAK_ACCENT} fill={STREAK_ACCENT} />
            <Text style={styles.title}>Sua caminhada</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {tabs.length > 1 && (
            <View style={styles.tabsRow}>
              {tabs.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.tabItem, tab === t.key && styles.tabItemOn]}
                  onPress={() => setTab(t.key)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      tab === t.key && styles.tabLabelOn,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {tab === "conquistas" && (
              <>
                <View style={styles.graceCard}>
                  <View style={styles.graceIcon}>
                    <ShieldCheck size={24} color={STREAK_ACCENT} />
                  </View>
                  <View style={styles.graceBody}>
                    <View style={styles.graceHeaderRow}>
                      <Text style={styles.graceTitle}>Saves</Text>
                      <Text style={styles.graceCount}>
                        {streak.grace}/{GRACE_MAX}
                      </Text>
                    </View>
                    <View style={styles.gracePips}>
                      {Array.from({ length: GRACE_MAX }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.gracePip,
                            i < streak.grace && styles.gracePipOn,
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.graceText}>
                      Ganhe saves a cada 7 dias de ofensiva de leitura da
                      liturgia. Um save perdoa um dia sem a liturgia diária para
                      manter sua ofensiva.
                    </Text>
                  </View>
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Conquistas</Text>
                  <Text style={styles.sectionCount}>
                    {unlockedCount}/{badges.length}
                  </Text>
                </View>

                <View style={styles.grid}>
                  {badges.map(({ def, unlocked, value, progress }) => {
                    const Icon = unlocked ? badgeIcon(def.iconId) : Lock;
                    return (
                      <View
                        key={def.id}
                        style={[
                          styles.badge,
                          unlocked ? styles.badgeUnlocked : styles.badgeLocked,
                        ]}
                      >
                        <View
                          style={[
                            styles.badgeIconWrap,
                            unlocked && styles.badgeIconWrapOn,
                          ]}
                        >
                          <Icon
                            size={24}
                            color={unlocked ? STREAK_ACCENT : colors.muted}
                          />
                        </View>
                        <Text
                          style={[
                            styles.badgeTitle,
                            !unlocked && styles.badgeTitleLocked,
                          ]}
                          numberOfLines={2}
                        >
                          {def.title}
                        </Text>
                        <Text style={styles.badgeDesc} numberOfLines={2}>
                          {def.description}
                        </Text>
                        {!unlocked && (
                          <>
                            <View style={styles.progressTrack}>
                              <View
                                style={[
                                  styles.progressFill,
                                  { width: `${Math.round(progress * 100)}%` },
                                ]}
                              />
                            </View>
                            <Text style={styles.badgeProgress}>
                              {value}/{def.threshold}
                            </Text>
                          </>
                        )}
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {tab === "molduras" && onSelectFrame && (
              <>
                <Text style={styles.seloHint}>
                  Toque para escolher a moldura do seu avatar.
                </Text>
                <View style={styles.frameRow}>
                  {FRAME_TIERS.map((f, i) => {
                    const unlocked = badgeCount >= f.minBadges;
                    const isShown = i === shownFrame;
                    return (
                      <TouchableOpacity
                        key={f.id}
                        activeOpacity={unlocked ? 0.8 : 1}
                        disabled={!unlocked}
                        onPress={() => onSelectFrame(f.id)}
                        style={[
                          styles.frameCard,
                          isShown && styles.frameCardOn,
                          !unlocked && styles.badgeLocked,
                        ]}
                      >
                        {isShown && (
                          <View style={styles.seloCheck}>
                            <Check size={12} color={colors.white} />
                          </View>
                        )}
                        <Avatar size={44} tier={unlocked ? i : 0} />
                        <Text style={styles.frameName} numberOfLines={1}>
                          {f.name}
                        </Text>
                        <Text style={styles.badgeProgress}>
                          {unlocked
                            ? f.minBadges === 0
                              ? "Sem moldura"
                              : "Desbloqueada"
                            : `${badgeCount}/${f.minBadges}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {tab === "efeitos" && onSelectEffect && (
              <>
                <Text style={styles.seloHint}>
                  Efeitos ao redor do avatar, desbloqueados por conquistas.
                </Text>
                <View style={styles.frameRow}>
                  {EFFECTS.map((e) => {
                    const unlocked = badgeCount >= e.minBadges;
                    const isShown = (selectedEffect ?? "none") === e.id;
                    return (
                      <TouchableOpacity
                        key={e.id}
                        activeOpacity={unlocked ? 0.8 : 1}
                        disabled={!unlocked}
                        onPress={() => onSelectEffect(e.id)}
                        style={[
                          styles.frameCard,
                          isShown && styles.frameCardOn,
                          !unlocked && styles.badgeLocked,
                        ]}
                      >
                        {isShown && (
                          <View style={styles.seloCheck}>
                            <Check size={12} color={colors.white} />
                          </View>
                        )}
                        <Avatar
                          size={44}
                          tier={shownFrame}
                          effect={unlocked ? e.id : "none"}
                        />
                        <Text style={styles.frameName} numberOfLines={1}>
                          {e.name}
                        </Text>
                        <Text style={styles.badgeProgress}>
                          {unlocked
                            ? e.minBadges === 0
                              ? "Padrão"
                              : "Desbloqueado"
                            : `${badgeCount}/${e.minBadges}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
