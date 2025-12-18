import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { styles } from "./styles";
import { DashboardHeader } from "@/components/DashboardHeader";
import { QuickAccessItem } from "@/components/QuickAccessItem";
import { HighlightCard } from "@/components/HighlightCard";
import { SafeAreaView } from "react-native-safe-area-context";

export function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <DashboardHeader name="Vitor" />

        <Text style={styles.section}>Acesso rápido</Text>

        <View style={styles.quick}>
          <QuickAccessItem label="Indique um amigo" onPress={() => {}} />
          <QuickAccessItem label="Acessar Wi-Fi" onPress={() => {}} />
          <QuickAccessItem label="Central de ajuda" onPress={() => {}} />
          <QuickAccessItem label="Compartilhar" onPress={() => {}} />
        </View>

        <Text style={styles.section}>Disponíveis para você</Text>

        <Text style={styles.section}>Destaque</Text>
        <HighlightCard />

        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
