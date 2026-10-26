import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NoteList } from '../components/NoteList';
import { colors } from '../theme/colors';
import BottomNav from '../components/BottomNav';
import { signOut } from '../services/auth';
import { fetchAllHarvests, type Harvest } from '../services/harvests';
import { fetchCurrentUser, type UserProfile } from '../services/users';

export default function Perfil() {
  const [activeTab, setActiveTab] = useState<'notes' | 'records'>('notes');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [harvests, setHarvests] = useState<Harvest[]>([]);

  useEffect(() => {
    let isActive = true;

    Promise.allSettled([fetchCurrentUser(), fetchAllHarvests()]).then(
      ([userResult, harvestResult]) => {
        if (!isActive) return;
        if (userResult.status === 'fulfilled') setUser(userResult.value);
        if (harvestResult.status === 'fulfilled') {
          setHarvests(harvestResult.value);
        }
      },
    );

    return () => {
      isActive = false;
    };
  }, []);

  const roleLabels: Record<string, string> = {
    family_farmer: 'Agricultor Familiar',
    company_admin: 'Administrador da empresa',
    company_worker: 'Funcionário',
  };
  const roleLabel = roleLabels[user?.userRole ?? ''] ?? 'Usuário';

  async function handleLogout() {
    try {
      await signOut();
    } catch {
      // Encerra a sessão local mesmo quando a API não responde.
    } finally {
      router.replace('/login');
    }
  }

  return (
  <ImageBackground
    source={require('../assets/images/bg-perfil.png')}
    resizeMode="stretch"
    style={{ flex: 1 }}
  >
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 140 }}
    >
      <View
        style={{
          height: 220,
          paddingTop: 38,
          paddingHorizontal: 24,
          backgroundColor: 'transparent',
        }}
      >
        <Image
          source={require('../assets/images/mb-bege.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          style={{
            position: 'absolute',
            right: 24,
            top: 34,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="log-out-outline" size={28} color={colors.cream} />
        </TouchableOpacity>
      </View>

        <View style={{ alignItems: 'center', marginTop: -78 }}>
          
          <View
            style={{
              width: 120,
              height: 120,
              position: 'relative',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: colors.red,
                backgroundColor: '#E8E8E8',
                overflow: 'hidden',
              }}
            >
              <Image
                source={user?.userImage ? { uri: user.userImage } : require('../assets/images/funcionaria.jpg')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </TouchableOpacity>

          </View>


          <View
            style={{
              width: '100%',
              paddingHorizontal: 36,
              alignItems: 'center',
              marginTop: 18,
            }}
          >
            <Text style={{ fontFamily: 'Livvic_700Bold', fontSize: 22, color: colors.red }}>
              {user?.userName ?? 'Carregando perfil...'}
            </Text>
            <Text
              style={{
                fontFamily: 'Livvic_400Regular',
                fontSize: 17,
                color: '#77777D',
                marginTop: 12,
              }}
            >
              {roleLabel}{user?.company ? ' • Empresa vinculada' : ''}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Ionicons name="mail-outline" size={18} color="#BDBDBD" />
              <Text style={{ fontFamily: 'Livvic_400Regular', fontSize: 16, color: '#77777D' }}>
                {user?.userEmail ?? 'Dados da conta'}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Livvic_400Regular',
                fontSize: 16,
                color: '#858585',
                marginTop: 8,
              }}
            >
              {harvests.length} registros de colheita
            </Text>

          </View>
        </View>

        <View style={{ paddingHorizontal: 28, paddingTop: 26 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 28,
              marginBottom: 22,
            }}
          >
            {[
              { key: 'notes', label: 'Anotações' },
              { key: 'records', label: 'Registros' },
            ].map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab(tab.key as 'notes' | 'records')}
                >
                  <Text
                    style={{
                      fontFamily: 'Livvic_700Bold',
                      fontSize: 20,
                      color: selected ? colors.red : colors.oliveLight,
                    }}
                  >
                    {tab.label}
                  </Text>
                  {selected && (
                    <View
                      style={{
                        height: 3,
                        borderRadius: 3,
                        backgroundColor: colors.red,
                        marginTop: 4,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {activeTab === 'notes' ? (
            <>
              <NoteList compact />
              <View style={{ marginTop: 10, alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/registros')}
                style={{
                  width: '76%',
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#8C8A5C',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Livvic_700Bold',
                    fontSize: 18,
                    color: colors.white,
                  }}
                >
                  Ver Registros
                </Text>
              </TouchableOpacity>
            </View>
            </>
          ) : (
            <View>
              {harvests.length === 0 ? (
                <Text style={{ textAlign: 'center', color: colors.olive, fontFamily: 'Livvic_400Regular' }}>
                  Nenhuma colheita registrada ainda.
                </Text>
              ) : harvests.slice(0, 5).map((harvest) => {
                const plantingName = typeof harvest.planting === 'object'
                  ? harvest.planting?.plantingName
                  : undefined;
                return (
                  <View key={harvest._id} style={{ backgroundColor: colors.white, borderRadius: 14, padding: 14, marginBottom: 12 }}>
                    <Text style={{ color: colors.text, fontFamily: 'Livvic_700Bold', fontSize: 17 }}>
                      {plantingName ?? 'Colheita registrada'}
                    </Text>
                    <Text style={{ color: colors.muted, fontFamily: 'Livvic_400Regular', marginTop: 6 }}>
                      {harvest.harvestedQuantity} unidades • {new Date(harvest.harvestDate).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <BottomNav />
    </View>
    </ImageBackground>
  );
}
