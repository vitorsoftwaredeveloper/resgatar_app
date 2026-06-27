import { CommunityGoalCard } from "@/components/CommunityGoalCard";
import { Header } from "@/components/Header";
import { NoticesCard } from "@/components/NoticesCard";
import { SectionDivider } from "@/components/SectionDivider";
import { StreakCard } from "@/components/StreakCard";
import { SwipeableTab } from "@/components/SwipeableTab";
import { AuthContext } from "@/context/AuthContext";
import { StreakService } from "@/services/StreakService";
import { IStreakData } from "@/storage/asyncStorage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { useStyles } from "./styles";

export function DashboardScreen() {
  const { member } = useContext(AuthContext);
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const [streak, setStreak] = useState<IStreakData | null>(null);

  const memberId = member?._id;

  // Início only displays progress — the read itself is recorded on the
  // Leituras tab, so reaching this screen never advances the streak.
  useFocusEffect(
    useCallback(() => {
      if (memberId) StreakService.getStatus(memberId).then(setStreak);
    }, [memberId]),
  );

  return (
    <SwipeableTab>
      <View style={styles.container}>
        <Header
          name={`${member?.firstName} ${member?.lastName}`}
          photo={member?.profileImage}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: tabBarHeight + 70 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <CommunityGoalCard />

          <StreakCard data={streak} />

          <NoticesCard />
        </ScrollView>
      </View>
    </SwipeableTab>
  );
}
