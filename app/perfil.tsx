import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { NoteList, PrimaryButton, RecordCard, colors } from '../components/mobo-ui';

export default function Perfil() {
  const [activeTab, setActiveTab] = useState<'notes' | 'records'>('notes');

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 18 }}
      >
        <View
          style={{
            height: 220,
            backgroundColor: colors.red,
            borderBottomLeftRadius: 112,
            borderBottomRightRadius: 112,
            paddingTop: 38,
            paddingHorizontal: 24,
          }}
        >
          <Image
            source={require('../assets/images/mb-bege.png')}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </View>

        <View style={{ alignItems: 'center', marginTop: -78 }}>
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
            <View
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.red,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="add" size={26} color={colors.white} />
            </View>
          </TouchableOpacity>

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
              <View style={{ marginTop: 10 }}>
                <PrimaryButton title="Ver Tudo" width="76%" />
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
    </View>
  );
}
