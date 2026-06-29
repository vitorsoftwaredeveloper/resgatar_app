import { BannerCarousel } from "@/components/BannerCarousel";
import { CommunityGoalCard } from "@/components/CommunityGoalCard";
import { Header } from "@/components/Header";
import { NoticesCard } from "@/components/NoticesCard";
import { StreakCard } from "@/components/StreakCard";
import { AuthContext } from "@/context/AuthContext";
import { getDashboardOrder, setDashboardOrder } from "@/storage/asyncStorage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useIsActive,
  useReorderableDrag,
} from "react-native-reorderable-list";
import { useStyles } from "./styles";

type CardId = "banners" | "streak" | "communityGoal" | "notices";

interface CardDef {
  id: CardId;
  Component: React.ComponentType;
}

const CARD_REGISTRY: CardDef[] = [
  { id: "banners", Component: BannerCarousel },
  { id: "streak", Component: StreakCard },
  { id: "communityGoal", Component: CommunityGoalCard },
  { id: "notices", Component: NoticesCard },
];

const DEFAULT_ORDER: CardId[] = ["banners", "streak", "communityGoal", "notices"];

function DraggableCardRow({ item }: { item: CardDef }) {
  const drag = useReorderableDrag();
  const active = useIsActive();
  const styles = useStyles();
  const { Component } = item;

  return (
    <Pressable
      onLongPress={drag}
      delayLongPress={300}
      style={[styles.cardWrapper, active && styles.cardWrapperActive]}
    >
      <Component />
    </Pressable>
  );
}

export function DashboardScreen() {
  const { member } = useContext(AuthContext);
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const [order, setOrder] = useState<CardId[]>(DEFAULT_ORDER);
  useEffect(() => {
    if (!member?._id) return;
    getDashboardOrder(member._id).then((saved) => {
      if (!saved) return;
      const merged = [
        ...saved.filter((id) => DEFAULT_ORDER.includes(id as CardId)),
        ...DEFAULT_ORDER.filter((id) => !saved.includes(id)),
      ] as CardId[];
      setOrder(merged);
    });
  }, [member?._id]);

  const sortedCards = order
    .map((id) => CARD_REGISTRY.find((c) => c.id === id))
    .filter(Boolean) as CardDef[];

  function handleReorder({ from, to }: ReorderableListReorderEvent) {
    setOrder((prev) => {
      const next = reorderItems(prev, from, to);
      if (member?._id) setDashboardOrder(member._id, next);
      return next;
    });
  }

  return (
    <View style={styles.container}>
      <Header
        name={`${member?.firstName} ${member?.lastName}`}
        photo={member?.profileImage}
      />
      <ReorderableList
        data={sortedCards}
        keyExtractor={(item) => item.id}
        onReorder={handleReorder}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + 70 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <DraggableCardRow item={item} />}
      />
    </View>
  );
}
