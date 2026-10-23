import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NoteList, PrimaryButton, RecordCard, colors } from '../components/mobo-ui';
import BottomNav from '../components/BottomNav';

export default function Perfil() {
  const [activeTab, setActiveTab] = useState<'notes' | 'records'>('notes');

  return (
  <ImageBackground
    source={require('../assets/images/bg-perfil.png')}
    resizeMode="stretch"
    style={{ flex: 1 }}
  >
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
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
                source={require('../assets/images/funcionaria.jpg')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: colors.red,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                elevation: 5,
              }}
            >
              <Ionicons name="add" size={32} color={colors.white} />
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
              Fernanda Mendes
            </Text>
            <Text
              style={{
                fontFamily: 'Livvic_400Regular',
                fontSize: 17,
                color: '#77777D',
                marginTop: 12,
              }}
            >
              Funcionário - Empresa Tal
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Ionicons name="location" size={18} color="#BDBDBD" />
              <Text style={{ fontFamily: 'Livvic_400Regular', fontSize: 16, color: '#77777D' }}>
                Localização
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
              20 anotações • 10 Registros
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{ position: 'absolute', right: 28, top: 26 }}
            >
              <Ionicons name="pencil" size={30} color="#000000" />
            </TouchableOpacity>
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
                onPress={() => router.push('/(tabs)/calendario')}
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
                  Ver Tudo
                </Text>
              </TouchableOpacity>
            </View>
            </>
          ) : (
            <View>
              <RecordCard index={0} />
              <RecordCard index={1} />
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