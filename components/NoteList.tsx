import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { colors } from '../theme/colors';

const notes = [
  { id: 'sample-1', title: 'Primeira colheita do mês', duration: '04:28 min' },
  { id: 'sample-2', title: 'Primeira colheita do mês', duration: '06:12 min' },
  { id: 'sample-3', title: 'Primeira colheita do mês', duration: '43:58 min' },
];

export function NoteList({ compact = false }: { compact?: boolean }) {
  return (
    <View style={{ gap: compact ? 10 : 16 }}>
      {notes.map((note) => (
        <View
          key={note.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: compact ? 10 : 18,
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.oliveLight,
              marginRight: compact ? 44 : 42,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Livvic_700Bold',
                fontSize: compact ? 16 : 17,
                color: colors.oliveDark,
              }}
              numberOfLines={1}
            >
              {note.title}
            </Text>
            <Text
              style={{
                fontFamily: 'Livvic_600SemiBold',
                fontSize: compact ? 16 : 17,
                color: '#B1B1B1',
                marginTop: compact ? 0 : 1,
                lineHeight: compact ? 21 : 24,
              }}
            >
              {compact ? note.duration.replace(' ', '\n') : note.duration}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={28} color={colors.olive} />
        </View>
      ))}
    </View>
  );
}
