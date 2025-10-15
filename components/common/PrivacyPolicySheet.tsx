import { theme } from "@/constants/theme";
import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomSheet } from "./BottomSheet";

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: (string | { text: string; children?: string[] })[];
};

const PRIVACY_POLICY: Section[] = [
  {
    title: "What Data We Collect",
    bullets: [
      "Camera: photos or video frames for profile photos, product images, or posts.",
      "Storage / Gallery: images or videos you select for listings, posts, or your profile picture.",
      "Precise location (GPS lat/long): used to show nearby marketplace products.",
      "Push-notification token: Firebase Cloud Messaging (FCM) token for chat and order notifications.",
      "Account details: e-mail address, display name, optional bio.",
      "User-generated content: items you list for sale, descriptions, prices, photos.",
      "Payment token (Stripe): encrypted identifier for payments; we never see full card numbers.",
      "Verification codes (Twilio): one-time SMS codes for phone verification.",
      "Usage & crash logs: anonymised diagnostics (device model, OS version, feature usage) to improve stability.",
      "We do NOT collect your contact list, microphone audio, SMS content, or biometric identifiers.",
    ],
  },
  {
    title: "Why We Collect This Data",
    bullets: [
      "To process payments securely and prevent fraud (Stripe).",
      "To improve the app by diagnosing crashes and understanding feature usage.",
      "To personalise your experience (e.g., location-relevant marketplace listings).",
      "To operate core features: posting items, updating profiles, messaging, and completing purchases.",
    ],
  },
  {
    title: "Who We Share Data With",
    bullets: [
      "Firebase (Google LLC): cloud messaging, analytics, and crash reports.",
      "Pusher: delivers real-time encrypted chat messages.",
      "Stripe: processes in-app payments; receives only encrypted tokens.",
      "Twilio: sends SMS verification codes.",
      "Cloud storage (AWS S3 / Firebase Storage): hosts images and files you upload.",
      "Other users: see the content you intentionally post (photos, listings, display name, location tag).",
      "We do not share with advertisers or data brokers.",
    ],
  },
  {
    title: "How Long We Keep Your Data",
    bullets: [
      "Marketplace posts & images — until you delete the post or request account deletion.",
      "Profile information — until you change it or request account deletion.",
      "Location look-ups & notification tokens — only while your account is active.",
      "Payment records (Stripe) — 7 years (bookkeeping requirement).",
      "Crash & usage logs — up to 24 months, then aggregated or deleted.",
    ],
  },
  {
    title: "Your Choices and Controls",
    bullets: [
      {
        text:
          "Runtime permissions — Android will ask the first time we need Camera, Location, or Storage. You may decline; that feature will be disabled.",
        children: ["Change later: System Settings → Apps → offgrid nation → Permissions."],
      },
      "Opt-out of analytics — toggle “Help us improve” in Settings.",
      "Delete or export your data — e-mail us; we respond within 7 days.",
    ],
  },
  {
    title: "Children’s Privacy",
    paragraphs: [
      "The app isn’t directed to children under 13, and we don’t knowingly collect personal data from them. If you believe a child has provided data, contact us and we’ll delete it promptly.",
    ],
  },
  {
    title: "Security Measures",
    bullets: [
      "End-to-end encryption for private chats.",
      "TLS/HTTPS on every network request.",
      "AES-256 encryption for stored images.",
      "Strong hashing and salting for passwords.",
      "Role-based access controls for staff.",
      "No system is 100% secure; please notify us immediately if you suspect unauthorised use.",
    ],
  },
  {
    title: "International Transfers",
    paragraphs: [
      "Our servers are located in the United States. By using the app, you consent to the transfer, storage, and processing of your information in the U.S. and any other country where we operate.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy periodically. We’ll notify you via an in-app banner or push notification; the new terms become effective when posted here.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: [
      "Eric / Offgrid Nation",
      "Registered office: 131 Continental Dr, Suite 305, Newark, DE 19713, USA",
    ],
    // (Email and Social links rendered separately below as tappable links)
  },
];

// Replace with your real social URLs
// const SOCIAL_LINKS = [
//   { label: "Facebook",  url: "https://facebook.com/theoffgridnation" },
//   { label: "X/Twitter", url: "https://x.com/theoffgridnation" },
//   { label: "LinkedIn",  url: "https://www.linkedin.com/company/offgridnation" },
//   { label: "Instagram", url: "https://instagram.com/theoffgridnation" },
//   { label: "YouTube",   url: "https://youtube.com/@theoffgridnation" },
//   { label: "Reddit",    url: "https://www.reddit.com/r/offgridnation" },
// ];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function BulletItem({ text, level = 0 }: { text: string; level?: number }) {
  return (
    <View style={[styles.bulletRow, level > 0 && { paddingLeft: 16 }]}>
      <Text style={styles.bulletSymbol}>{level === 0 ? "•" : "◦"}</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function BulletList({
  items,
  level = 0,
}: {
  items: (string | { text: string; children?: string[] })[];
  level?: number;
}) {
  return (
    <View style={{ marginTop: 6 }}>
      {items.map((item, idx) => {
        if (typeof item === "string") {
          return <BulletItem key={idx} text={item} level={level} />;
        }
        return (
          <View key={idx}>
            <BulletItem text={item.text} level={level} />
            {item.children?.length ? (
              <BulletList items={item.children} level={level + 1} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

// function InlineLinkList({ links }: { links: { label: string; url: string }[] }) {
//   const open = (url: string) => Linking.openURL(url).catch(() => {});
//   return (
//     <Text style={styles.paragraph}>
//       Social:{" "}
//       {links.map((l, i) => (
//         <Text key={l.label}>
//           <Text style={styles.link} onPress={() => open(l.url)}>
//             {l.label}
//           </Text>
//           {i < links.length - 1 ? " · " : ""}
//         </Text>
//       ))}
//     </Text>
//   );
// }

export const PrivacyPolicySheet = ({
  isPrivacyModal,
  onClose,
}: {
  isPrivacyModal: boolean;
  onClose: () => void;
}) => {
  const handleMail = () => Linking.openURL("mailto:hello@theoffgridnation.com").catch(() => {});

  return (
    <BottomSheet visible={isPrivacyModal} onClose={onClose} height="90%">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Text style={styles.header}>Privacy Policy</Text>
        <Paragraph>
          Thank you for choosing to be part of our community at Offgrid Nation. This policy explains
          how the mobile application “offgrid nation” collects, uses, and shares information when you
          use it on a device.
        </Paragraph>

        {PRIVACY_POLICY.map((sec, i) => (
          <View key={i} style={styles.section}>
            <SectionTitle>{sec.title}</SectionTitle>
            {sec.paragraphs?.map((p, j) => (
              <Paragraph key={j}>{p}</Paragraph>
            ))}
            {sec.bullets ? <BulletList items={sec.bullets} /> : null}
          </View>
        ))}

        {/* Contact actions */}
        <View style={{ marginTop: 8 }}>
          <Pressable onPress={handleMail}>
            <Text style={styles.link}>Email us: hello@theoffgridnation.com</Text>
          </Pressable>
        </View>

        {/* <View style={{ marginTop: 4 }}>
          <InlineLinkList links={SOCIAL_LINKS} />
        </View> */}

        <View style={{ height: 12 }} />
        <Paragraph>© Offgrid Nation 2025. All Rights Reserved.</Paragraph>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 8,
  },
  header: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  paragraph: {
    color: theme.colors.textPrimary,
    lineHeight: 20,
    fontSize: 14,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bulletSymbol: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 20,
    width: 18,
  },
  bulletText: {
    color: theme.colors.textPrimary,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    fontWeight: "600",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
