import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import MaskInput, { Masks } from "react-native-mask-input";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import api from "../config/api";
import { saveToken } from "../config/auth";
import { colors } from "../components/mobo-ui";

const accountOptions = ["Nenhum", "CEO de Empresa", "Agricultor Familiar"];

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("Nenhum");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dap, setDap] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { width, height } = useWindowDimensions();
  const horizontalPadding = width * 0.1;
  const isAgricultor = accountType === "Agricultor Familiar";

  async function handlePickProfileImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permissão necessária para acessar a galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    if (!name.trim()) {
      alert("Digite seu nome.");
      return;
    }
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("Preencha todos os campos.");
      return;
    }
    if (!email.includes("@")) {
      alert("Digite um e-mail válido.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas precisam ser iguais.");
      return;
    }
    if (!phone.trim()) {
      alert("Preencha o telefone.");
      return;
    }
    if (isAgricultor && !cpf.trim()) {
      alert("Preencha o CPF.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userName", name);
      formData.append("userEmail", email);
      formData.append("userPassword", password);
      formData.append("userRole", accountType);
      formData.append("userPhone", phone.replace(/\D/g, ""));
      if (isAgricultor) {
        formData.append("farmerDetails.cpf", cpf.replace(/\D/g, ""));
        formData.append("farmerDetails.dap", dap);
      }

      if (profileImage) {
        const filename = profileImage.split("/").pop() ?? "profile.jpg";
        formData.append("profileImage", {
          uri: profileImage,
          name: filename,
          type: "image/jpeg, image/png, image/jpg",
        } as any);
      }

      const response = await api.post("/auth/register", formData);
      if (response.data.success) {
        await saveToken(response.data.token);
        router.replace("/home");
      }
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
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

          <View style={styles.hero}>
            <Image
              source={require("../assets/images/robofrosa.png")}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          <View
            style={[styles.formPanel, { paddingHorizontal: horizontalPadding }]}
          >
            {/* Avatar */}
            <View style={styles.avatarArea}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.avatarButton}
                onPress={handlePickProfileImage}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons name="person" size={76} color="#F2E6EA" />
                )}
                <View style={styles.avatarAddButton}>
                  <Ionicons name="add" size={30} color={colors.white} />
                </View>
              </TouchableOpacity>
              <Text style={styles.title}>Realize seu Cadastro!</Text>
            </View>

            {/* Nome */}
            <View style={styles.fieldWrapper}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Nome</Text>
              </View>
              <View style={styles.field}>
                <Ionicons
                  name="person-outline"
                  size={31}
                  color={colors.cream}
                  style={styles.fieldIcon}
                />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#D38BA2"
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Email */}
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
                  placeholder="Digite seu email"
                  placeholderTextColor="#D38BA2"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Telefone */}
            <View style={styles.fieldWrapper}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Telefone</Text>
              </View>
              <View style={styles.field}>
                <Ionicons
                  name="call-outline"
                  size={31}
                  color={colors.cream}
                  style={styles.fieldIcon}
                />
                <MaskInput
                  value={phone}
                  onChangeText={(masked) => setPhone(masked)}
                  mask={Masks.BRL_PHONE}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#D38BA2"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Tipo de Conta */}
            <View style={[styles.fieldWrapper, { marginBottom: 24 }]}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Tipo de Conta</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.field}
                onPress={() => setDropdownVisible(true)}
              >
                <Ionicons
                  name="person-outline"
                  size={31}
                  color={colors.cream}
                  style={styles.fieldIcon}
                />
                <Text style={styles.dropdownText}>{accountType}</Text>
                <Ionicons name="chevron-down" size={24} color={colors.cream} />
              </TouchableOpacity>
            </View>

            {/* CPF — só para Agricultor Familiar */}
            {isAgricultor && (
              <View style={styles.fieldWrapper}>
                <View style={styles.labelBox}>
                  <Text style={styles.labelText}>CPF</Text>
                </View>
                <View style={styles.field}>
                  <Ionicons
                    name="id-card-outline"
                    size={31}
                    color={colors.cream}
                    style={styles.fieldIcon}
                  />
                  <MaskInput
                    value={cpf}
                    onChangeText={(masked) => setCpf(masked)}
                    mask={Masks.BRL_CPF}
                    placeholder="000.000.000-00"
                    placeholderTextColor="#D38BA2"
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                </View>
              </View>
            )}

            {/* DAP — só para Agricultor Familiar */}
            {isAgricultor && (
              <View style={styles.fieldWrapper}>
                <View style={styles.labelBox}>
                  <Text style={styles.labelText}>DAP</Text>
                </View>
                <View style={styles.field}>
                  <Ionicons
                    name="location-outline"
                    size={31}
                    color={colors.cream}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    value={dap}
                    onChangeText={setDap}
                    placeholder="Digite seu DAP"
                    placeholderTextColor="#D38BA2"
                    style={styles.input}
                  />
                </View>
              </View>
            )}

            {/* Senha */}
            <View style={styles.fieldWrapper}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Senha</Text>
              </View>
              <View style={styles.field}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowPassword((v) => !v)}
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
                  placeholder="Digite sua senha"
                  placeholderTextColor="#D38BA2"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Confirmar Senha */}
            <View style={[styles.fieldWrapper, { marginBottom: 42 }]}>
              <View style={styles.field}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  style={styles.passwordEyeButton}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={34}
                    color={colors.cream}
                  />
                </TouchableOpacity>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#D38BA2"
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Botão */}
            <View style={styles.buttonShadow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmit}
                style={styles.registerButton}
              >
                <Text style={styles.registerButtonText}>Cadastrar-se</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/login")}
              style={styles.loginLinkButton}
            >
              <Text style={styles.loginText}>
                Já possui conta?{" "}
                <Text style={styles.loginStrong}>Faça o login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownTitle}>Selecione o tipo de conta</Text>
            {accountOptions.map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.8}
                style={styles.dropdownOption}
                onPress={() => {
                  setAccountType(option);
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.wine },
  scroll: { flex: 1, backgroundColor: colors.wine },
  scrollContent: { flexGrow: 1, backgroundColor: colors.wine },
  phoneFrame: { flexGrow: 1, width: "100%", backgroundColor: colors.red },
  logo: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    width: 112,
    height: 64,
    zIndex: 5,
  },
  hero: { height: 380, marginTop: 92, overflow: "hidden", zIndex: 2 },
  heroImage: { width: "100%", height: "100%" },
  formPanel: {
    flex: 1,
    marginTop: -45,
    minHeight: 900,
    backgroundColor: "rgba(110, 0, 38, 0.80)",
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    paddingTop: 36,
    paddingBottom: 46,
    zIndex: 3,
  },
  avatarArea: { alignItems: "center", marginBottom: 28 },
  avatarButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: colors.cream,
    backgroundColor: "rgba(248, 242, 235, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 56 },
  avatarAddButton: {
    position: "absolute",
    right: -4,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C7034B",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.cream,
    fontFamily: "Livvic_400Regular",
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    marginTop: 16,
  },
  fieldWrapper: { height: 76, marginBottom: 24, justifyContent: "flex-end" },
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
    paddingHorizontal: 8,
  },
  labelText: {
    color: colors.cream,
    fontFamily: "Livvic_400Regular",
    fontSize: 22,
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
  fieldIcon: { marginRight: 18 },
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
  dropdownText: {
    flex: 1,
    color: colors.cream,
    fontFamily: "Livvic_400Regular",
    fontSize: 21,
  },
  buttonShadow: {
    borderRadius: 15,
    backgroundColor: colors.wineDark,
    paddingBottom: 8,
  },
  registerButton: {
    height: 66,
    borderRadius: 15,
    backgroundColor: "#C7034B",
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: colors.white,
    fontFamily: "Livvic_700Bold",
    fontSize: 22,
  },
  loginLinkButton: { marginTop: 31 },
  loginText: {
    textAlign: "center",
    color: "#DDD8C9",
    fontFamily: "Livvic_400Regular",
    fontSize: 20,
    lineHeight: 28,
  },
  loginStrong: { color: colors.cream, fontFamily: "Livvic_700Bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  dropdownBox: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "rgba(110, 0, 38, 0.94)",
    borderWidth: 1.5,
    borderColor: "rgba(248, 242, 235, 0.35)",
    paddingTop: 22,
    paddingBottom: 14,
    overflow: "hidden",
  },
  dropdownTitle: {
    color: "#E3B1BF",
    fontFamily: "Livvic_400Regular",
    fontSize: 20,
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  dropdownOption: { paddingVertical: 16, paddingHorizontal: 22 },
  dropdownOptionText: {
    color: colors.cream,
    fontFamily: "Livvic_400Regular",
    fontSize: 22,
  },
});
