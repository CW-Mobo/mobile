import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  BackHandler,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import api from "../config/api";
import { saveToken } from "../config/auth";
import { colors } from "../components/mobo-ui";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { width, height } = useWindowDimensions();
  const horizontalPadding = width * 0.1;

  async function handleLogin() {
    if (!email.trim()) {
      alert("Digite seu e-mail.");
      return;
    }

    if (!email.includes("@")) {
      alert("Digite um e-mail válido.");
      return;
    }

    if (!password.trim()) {
      alert("Digite sua senha.");
      return;
    }

    try {
      const response = await api.post("auth/login", {
        userEmail: email,
        userPassword: password,
      });

      if (response.data.success) {
        await saveToken(response.data.token);
        router.replace("/home");
      }
    } catch (error: any) {
      const mensagem = error.response?.data?.message || "Erro ao fazer login.";
      alert(mensagem);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" backgroundColor={colors.red} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: Math.max(height, 844) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.phoneFrame}>
          <Image
            source={require("../assets/images/logo-branca.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.8}
            // ação de sair
            onPress={() => BackHandler.exitApp()}
          >
            <Ionicons name="close-outline" size={30} color={colors.cream} />
          </TouchableOpacity>

          <View style={styles.hero}>
            <Image
              source={require("../assets/images/robofrosa.png")}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          <View
            style={[
              styles.formPanel,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <Text style={styles.title}>Bem Vindo!</Text>

            <View style={styles.fieldWrapper}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Email</Text>
              </View>

              <View style={styles.field}>
                <Ionicons
                  name="mail-outline"
                  size={31}
                  color={colors.cream}
                  style={styles.fieldIcon}
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="E-mail"
                  placeholderTextColor="#D38BA2"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.fieldWrapper}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Senha</Text>
              </View>

              <View style={styles.field}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowPassword((value) => !value)}
                  style={styles.passwordEyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={34}
                    color={colors.cream}
                  />
                </TouchableOpacity>

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Senha"
                  placeholderTextColor="#D38BA2"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRememberMe((value) => !value)}
                style={styles.rememberButton}
              >
                <View style={styles.checkbox}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={25} color="#A98F65" />
                  )}
                </View>

                <Text style={styles.helperText}>Lembre-se</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.helperText}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonShadow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLogin}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/cadastro")}
              style={styles.signupButton}
            >
              <Text style={styles.signupText}>
                Ainda não possui conta?{" "}
                <Text style={styles.signupStrong}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.wine,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.wine,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.wine,
  },
  phoneFrame: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: colors.red,
  },
  logo: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    width: 112,
    height: 64,
    zIndex: 5,
  },
  hero: {
    height: 380,
    marginTop: 92,
    overflow: "hidden",
    zIndex: 2,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  formPanel: {
    flex: 1,
    marginTop: -45,
    minHeight: 520,
    backgroundColor: "rgba(110, 0, 38, 0.80)",
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    paddingTop: 43,
    paddingBottom: 48,
    zIndex: 3,
  },
  title: {
    color: colors.cream,
    fontFamily: "Livvic_400Regular",
    fontSize: 29,
    lineHeight: 36,
    textAlign: "center",
    marginBottom: 36,
  },
  fieldWrapper: {
    height: 76,
    marginBottom: 24,
    justifyContent: "flex-end",
  },
  labelBox: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    minWidth: 104,
    height: 30,
    backgroundColor: colors.wine,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  labelText: {
    color: colors.cream,
    fontFamily: "Livvic_400Regular",
    fontSize: 21,
    lineHeight: 28,
  },
  field: {
    height: 66,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.cream,
    backgroundColor: colors.wine,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 21,
    paddingRight: 16,
  },
  fieldIcon: {
    marginRight: 18,
  },
  passwordEyeButton: {
    width: 40,
    height: 44,
    marginRight: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.cream,
    fontFamily: "Livvic_400Regular",
    fontSize: 21,
    paddingVertical: 0,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 1,
    marginBottom: 42,
  },
  rememberButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: "#E5DFD0",
    alignItems: "center",
    justifyContent: "center",
  },
  helperText: {
    color: "#E5DFD0",
    fontFamily: "Livvic_400Regular",
    fontSize: 17,
    lineHeight: 26,
  },
  buttonShadow: {
    borderRadius: 15,
    backgroundColor: colors.wineDark,
    paddingBottom: 8,
  },
  loginButton: {
    height: 66,
    borderRadius: 15,
    backgroundColor: "#C7034B",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: colors.white,
    fontFamily: "Livvic_700Bold",
    fontSize: 21,
  },
  signupButton: {
    marginTop: 31,
  },
  signupText: {
    textAlign: "center",
    color: "#DDD8C9",
    fontFamily: "Livvic_400Regular",
    fontSize: 20,
    lineHeight: 28,
  },
  signupStrong: {
    color: colors.cream,
    fontFamily: "Livvic_700Bold",
  },

  closeButton: {
    position: "absolute",
    top: 52,
    right: 22,
    zIndex: 10,

    width: 30,
    height: 30,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(194, 25, 61, 100)",
  },
});
