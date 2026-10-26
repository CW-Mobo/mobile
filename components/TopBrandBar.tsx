import { Image, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export function TopBrandBar() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top, backgroundColor: colors.red }}>
      <StatusBar style="light" />
      <View
        style={{
          height: 55,
          backgroundColor: colors.red,
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Image
          source={require('../assets/images/mb-bege.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
