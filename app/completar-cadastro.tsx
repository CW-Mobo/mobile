
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../components/mobo-ui';

const accountOptions = [
  'Nenhum',
  'CEO de Empresa',
  'Funcionário',
  'Agricultor Familiar',
];

export default function CompletarCadastro() {
  const [accountType, setAccountType] = useState('Nenhum');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cap, setCap] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { width, height } = useWindowDimensions();
  const horizontalPadding = width * 0.1;

  async function handlePickProfileImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permissão necessária para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  function handleSubmit() {
    if (!phone.trim() || !cpf.trim() || !cap.trim()) {
      alert('Complete os dados do cadastro.');
      return;
    }

    router.replace('/(tabs)/home');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={38} color={colors.cream} />
          </TouchableOpacity>

          <Image
            source={require('../assets/images/logo-branca.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.hero}>
            <Image
              source={require('../assets/images/robofrosa.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.formPanel, { paddingHorizontal: horizontalPadding }]}>
            <View style={styles.avatarArea}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.avatarButton}
                onPress={handlePickProfileImage}
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={76} color="#F2E6EA" />
                )}

                <View style={styles.avatarAddButton}>
                  <Ionicons name="add" size={30} color={colors.white} />
                </View>
              </TouchableOpacity>

              <Text style={styles.title}>Complete seu Cadastro!</Text>

              <Text style={styles.subtitle}>
                Precisamos de mais algumas{'\n'}informações para criar sua conta.
              </Text>
            </View>

            <View style={[styles.fieldWrapper, { marginBottom: 24 }]}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Tipo de Usuário:</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.field}
                onPress={() => setDropdownVisible(true)}
              >
                <Ionicons
                  name="person-outline"
                  size={34}
                  color={colors.cream}
                  style={styles.fieldIcon}
                />

                <Text style={styles.dropdownText}>{accountType}</Text>

                <Ionicons name="chevron-down" size={24} color={colors.cream} />
              </TouchableOpacity>
            </View>

            <ProfileField
              icon="call-outline"
              label="Telefone*"
              value={phone}
              onChangeText={setPhone}
              placeholder="(00)00000-0000"
              keyboardType="phone-pad"
            />

            <ProfileField
              icon="id-card-outline"
              label="CPF*"
              value={cpf}
              onChangeText={setCpf}
              placeholder="000.000.000-00"
              keyboardType="number-pad"
            />

            <ProfileField
              icon="location-outline"
              label="CAP"
              value={cap}
              onChangeText={setCap}
              placeholder="Digite seu DAP"
              fieldMarginBottom={36}
            />

            <View style={styles.buttonShadow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmit}
                style={styles.registerButton}
              >
                <Text style={styles.registerButtonText}>Cadastrar-se</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityRow}>
              <Ionicons name="lock-closed-outline" size={24} color="#C7034B" />
              <Text style={styles.securityText}>Seus dados estão protegidos</Text>
            </View>
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

function ProfileField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  fieldMarginBottom = 24,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  fieldMarginBottom?: number;
}) {
  return (
    <View style={[styles.fieldWrapper, { marginBottom: fieldMarginBottom }]}>
      <View style={styles.labelBox}>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <View style={styles.field}>
        <Ionicons name={icon} size={34} color={colors.cream} style={styles.fieldIcon} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#E3B1BF"
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    </View>
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
    width: '100%',
    backgroundColor: colors.red,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 38,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    width: 112,
    height: 64,
    zIndex: 5,
  },
  hero: {
    height: 380,
    marginTop: 92,
    overflow: 'hidden',
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.78,
  },
  formPanel: {
    flex: 1,
    marginTop: -255,
    minHeight: 760,
    backgroundColor: 'rgba(110, 0, 38, 0.86)',
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    paddingTop: 64,
    paddingBottom: 48,
    zIndex: 3,
  },
  avatarArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: colors.cream,
    backgroundColor: 'rgba(248, 242, 235, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  avatarAddButton: {
    position: 'absolute',
    right: -4,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.magenta ?? '#C7034B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.cream,
    fontFamily: 'Livvic_400Regular',
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    color: '#E8E3D3',
    fontFamily: 'Livvic_400Regular',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 8,
  },
  fieldWrapper: {
    height: 76,
    justifyContent: 'flex-end',
  },
  labelBox: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    minWidth: 120,
    height: 30,
    backgroundColor: colors.wine,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 12,
  },
  labelText: {
    color: colors.cream,
    fontFamily: 'Livvic_400Regular',
    fontSize: 22,
    lineHeight: 28,
  },
  field: {
    height: 66,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.cream,
    backgroundColor: colors.wine,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 21,
    paddingRight: 16,
  },
  fieldIcon: {
    marginRight: 18,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.cream,
    fontFamily: 'Livvic_400Regular',
    fontSize: 21,
    paddingVertical: 0,
  },
  dropdownText: {
    flex: 1,
    color: colors.cream,
    fontFamily: 'Livvic_400Regular',
    fontSize: 21,
  },
  buttonShadow: {
    borderRadius: 15,
    backgroundColor: colors.wineDark,
    paddingBottom: 8,
    marginTop: 10,
  },
  registerButton: {
    height: 66,
    borderRadius: 15,
    backgroundColor: '#C7034B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: colors.white,
    fontFamily: 'Livvic_700Bold',
    fontSize: 22,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
    gap: 10,
  },
  securityText: {
    color: '#DDD8C9',
    fontFamily: 'Livvic_400Regular',
    fontSize: 21,
    lineHeight: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  dropdownBox: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: 'rgba(110, 0, 38, 0.94)',
    borderWidth: 1.5,
    borderColor: 'rgba(248, 242, 235, 0.35)',
    paddingTop: 22,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  dropdownTitle: {
    color: '#E3B1BF',
    fontFamily: 'Livvic_400Regular',
    fontSize: 20,
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  dropdownOption: {
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  dropdownOptionText: {
    color: colors.cream,
    fontFamily: 'Livvic_400Regular',
    fontSize: 22,
  },
});