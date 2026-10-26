import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE = '#810C29';
const INACTIVE = '#8C8A5C';

const items = [
  { route: '/home', label: 'Home', icon: 'home-outline' as const },
  { route: '/registros', label: 'Calendário', icon: 'calendar-outline' as const },
  { route: '/perfil', label: 'Perfil', icon: 'person-outline' as const },
  { route: '/controle', label: 'Controle', icon: 'game-controller' as const },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        height: 76 + bottom,
        width: '100%',
        backgroundColor: '#FFFFFF',
      }}
    >
      <View
        style={{
          height: 76,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 8,
          borderTopWidth: 0,
        }}
      >
        {items.map((item) => {
          const selected = pathname === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              activeOpacity={0.8}
              onPress={() => router.replace(item.route as any)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={{
                flex: 1,
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selected ? (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: ACTIVE,
                      fontFamily: 'Livvic_700Bold',
                      fontSize: 17,
                    }}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={{
                      width: Math.max(28, item.label.length * 7),
                      height: 2.5,
                      borderRadius: 2,
                      backgroundColor: ACTIVE,
                      marginTop: 5,
                    }}
                  />
                </View>
              ) : (
                <Ionicons name={item.icon} size={31} color={INACTIVE} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
