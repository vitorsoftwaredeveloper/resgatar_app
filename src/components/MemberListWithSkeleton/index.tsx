import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { SettingsMemberCard } from "@/components/SettingsMemberCard";
import { IMember } from "@/types/Member";
import { SPACING } from "@/theme";
import { useAppTheme } from "@/context/ThemeContext";
import { useMemo } from "react";

interface Props {
  members: IMember[];
  loading: boolean;
  onAction: (member: IMember) => void;
  iconAction: React.ReactElement;
  variant: "delete" | "edit";
}

const SKELETON_COUNT = 4;

function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "#00000055",
        },
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        list: {
          marginTop: SPACING.xxs,
        },
        listContent: {
          gap: SPACING.sm2,
        },
      }),
    [colors],
  );
}

export function MemberListWithSkeleton({
  members,
  loading,
  onAction,
  iconAction,
  variant,
}: Props) {
  const styles = useStyles();

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <FlatList
          data={loading ? Array.from({ length: SKELETON_COUNT }) : members}
          keyExtractor={(_, index) =>
            loading ? `skeleton-${index}` : members[index]._id
          }
          renderItem={({ item }: any) =>
            loading ? (
              <RemoveMemberSkeleton />
            ) : (
              <SettingsMemberCard
                member={item}
                onAction={onAction}
                iconAction={iconAction}
                variant={variant}
              />
            )
          }
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
