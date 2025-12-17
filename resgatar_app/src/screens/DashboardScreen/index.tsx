import { AuthContext } from "@/context/AuthContext";
import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { colors } from "@/theme/colors";
import { User, Bell } from "lucide-react-native";

const { width } = Dimensions.get("window");

export const DashboardScreen = () => {
  const { member } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconPlaceholder} />
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.username}>{member?.firstName}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.notificationWrapper}>
            <View style={styles.avatar}>
              <Bell size={28} color={colors.primary.dark} />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>304</Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <User size={28} color={colors.primary.dark} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
          {/* Acesso rápido */}
          <Text style={styles.sectionTitle}>Acesso rápido</Text>
          <View style={styles.quickAccessRow}>
            {[
              "Indique um amigo",
              "Acessar Wi‑Fi",
              "Central de ajuda",
              "Compartilhar Wi‑Fi",
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.quickAccessItem}>
                <View style={styles.quickIcon} />
                <Text style={styles.quickText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Disponíveis para o seu plano */}
          <Text style={styles.sectionTitle}>Disponíveis para o seu plano</Text>
          <TouchableOpacity style={styles.horizontalCard}>
            <View style={styles.serviceImage} />
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>Serviço</Text>
              <Text style={styles.serviceSubtitle}>
                Descrição do serviço disponível
              </Text>
              <Text style={styles.serviceAction}>Saiba mais</Text>
            </View>
          </TouchableOpacity>

          {/* Destaque */}
          <Text style={styles.sectionTitle}>Destaque</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.carouselItem}>
                <Text style={styles.carouselText}>Conteúdo em destaque</Text>
                <TouchableOpacity style={styles.carouselButton}>
                  <Text>Faça o upgrade agora</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.paginationDot} />
            ))}
          </View>

          {/* Ofertas imperdíveis */}
          <Text style={styles.sectionTitle}>Ofertas imperdíveis</Text>
          {[1, 2].map((_, index) => (
            <View key={index} style={styles.offerCard}>
              <View style={styles.offerImage} />
              <Text style={styles.offerText}>Descrição da oferta</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
