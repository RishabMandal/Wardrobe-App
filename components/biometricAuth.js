// biometricAuth.js
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export async function authenticateWithBiometrics(options = {}) {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        "Unavailable",
        "Biometric authentication is not available or set up."
      );
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with fingerprint",
      fallbackLabel: "Use passcode",
      ...options,
    });

    if (result.success) {
      return true;
    } else {
      Alert.alert(
        "Authentication Failed",
        result.error || "Biometric auth failed."
      );
      return false;
    }
  } catch (error) {
    Alert.alert("Error", error.message);
    return false;
  }
}
