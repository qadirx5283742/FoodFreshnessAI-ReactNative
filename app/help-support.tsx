import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ExpoClipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const FAQS = [
    { question: t("FAQ_1_Q"), answer: t("FAQ_1_A") },
    { question: t("FAQ_2_Q"), answer: t("FAQ_2_A") },
    { question: t("FAQ_3_Q"), answer: t("FAQ_3_A") },
    { question: t("FAQ_4_Q"), answer: t("FAQ_4_A") },
    { question: t("FAQ_5_Q"), answer: t("FAQ_5_A") },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleCopy = async (text: string, label: string) => {
    await ExpoClipboard.setStringAsync(text);
    Alert.alert(t("COPIED_TITLE"), t("COPIED_MSG", { label }));
  };

  const ContactCard = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity
      style={[
        styles.contactCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View
        style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}
      >
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="content-copy"
        size={18}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("HELP_TITLE")}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="face-agent" size={50} color="white" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {t("HELP_HERO_TITLE")}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            {t("HELP_HERO_SUBTITLE")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t("CONTACT_US_TITLE")}
          </Text>
          <ContactCard
            icon="email-outline"
            title={t("EMAIL_SUPPORT")}
            subtitle="support@foodfreshness.ai"
            onPress={() =>
              handleCopy("support@foodfreshness.ai", "Email address")
            }
          />
          <ContactCard
            icon="phone-outline"
            title={t("PHONE_SUPPORT")}
            subtitle="+1 (800) 123-4567"
            onPress={() => handleCopy("+1 (800) 123-4567", "Phone number")}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t("FAQ_TITLE")}
          </Text>
          {FAQS.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.faqItem,
                {
                  backgroundColor: colors.surface,
                  borderColor:
                    expandedIndex === index ? colors.primary : colors.border,
                },
              ]}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  {faq.question}
                </Text>
                <MaterialCommunityIcons
                  name={expandedIndex === index ? "minus" : "plus"}
                  size={20}
                  color={
                    expandedIndex === index
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
              </View>
              {expandedIndex === index && (
                <View style={styles.faqAnswerContainer}>
                  <Text
                    style={[styles.faqAnswer, { color: colors.textSecondary }]}
                  >
                    {faq.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          {t("COPYRIGHT_2")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 15,
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  contactSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  faqItem: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F020",
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 15,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 30,
    opacity: 0.6,
  },
});
