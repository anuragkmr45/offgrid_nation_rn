import { theme } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary, paddingHorizontal: 24 },
  safeArea: { flex: 1, justifyContent: 'center' },
  title: { fontSize: theme.fontSizes.headlineSmall, fontWeight: "600", color: theme.colors.background, marginBottom: 16, textAlign: 'center' },
  subtitle: { color: theme.colors.background, textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: theme.colors.background, borderRadius: 25, height: 50, paddingHorizontal: 16, marginVertical: 8, color: theme.colors.textPrimary },
  inputWrapper: { position: 'relative' },
  eyeButton: { position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -12 }] },
  button: { marginTop: 24, height: 50, borderRadius: 25, backgroundColor: theme.colors.background },
  buttonDisabled: { opacity: 0.5 },
  errorText: { color: theme.colors.accent, fontSize: 12, marginTop: 4 },
  resendText: { color: theme.colors.background, marginTop: 8, textAlign: 'center' }
});