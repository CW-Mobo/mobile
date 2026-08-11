import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export const colors = {
  cream: '#F8F2EB',
  red: '#C2193D',
  wine: '#810C29',
  wineDark: '#61001E',
  magenta: '#B70A49',
  field: '#9A203D',
  olive: '#8C8A5C',
  oliveLight: '#BAB88C',
  oliveDark: '#383D22',
  greenDark: '#192116',
  text: '#2C2C2C',
  muted: '#8C8C8C',
  soft: '#ECE2D6',
  white: '#FFFFFF',
};

export function TopBrandBar({ tall = false }: { tall?: boolean }) {
  return (
    <>
      <View style={{ height: 35, backgroundColor: colors.cream }} />
      <View
        style={{
          height: tall ? 104 : 55,
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
    </>
  );
}

export function ShadowField({
  children,
  height = 70,
}: {
  children: ReactNode;
  height?: number;
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          position: 'absolute',
          bottom: -7,
          left: 0,
          right: 0,
          height,
          borderRadius: 16,
          backgroundColor: '#DDD9C9',
        }}
      />
      <View
        style={{
          minHeight: height,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: colors.cream,
          backgroundColor: colors.field,
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  width = '100%',
}: {
  title: string;
  onPress?: () => void;
  width?: number | `${number}%`;
}) {
  return (
    <View style={{ width, alignSelf: 'center' }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -10,
          height: 54,
          borderRadius: 16,
          backgroundColor: colors.wineDark,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={{
          minHeight: 58,
          borderRadius: 16,
          backgroundColor: colors.magenta,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: 'Livvic_700Bold',
            fontSize: 18,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function SectionTabs({
  active,
  accent = colors.olive,
}: {
  active: 'notes' | 'records';
  accent?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 28,
        marginBottom: 22,
      }}
    >
      {[
        { key: 'notes', label: 'Anotações' },
        { key: 'records', label: 'Registros' },
      ].map((tab) => {
        const selected = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() =>
              tab.key === 'notes'
                ? router.push('/(tabs)/calendario')
                : router.push('/(tabs)/registros')
            }
          >
            <Text
              style={{
                fontFamily: 'Livvic_700Bold',
                fontSize: 20,
                color: selected ? accent : colors.oliveLight,
              }}
            >
              {tab.label}
            </Text>
            {selected && (
              <View
                style={{
                  height: 3,
                  borderRadius: 3,
                  backgroundColor: accent,
                  marginTop: 3,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export type CalendarNote = {
  id: string;
  title: string;
  duration: string;
  date: string;
};

export function NoteList({
  compact = false,
  notes,
  selectable = false,
  selectedIds = [],
  onToggleNote,
}: {
  compact?: boolean;
  notes?: CalendarNote[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggleNote?: (id: string) => void;
}) {
  const items =
    notes ??
    [
      { id: 'sample-1', title: 'Primeira Colheita do mês', duration: '04:28 min', date: '' },
      { id: 'sample-2', title: 'Primeira Colheita do mês', duration: '06:12 min', date: '' },
      { id: 'sample-3', title: 'Primeira Colheita do mês', duration: '43:58 min', date: '' },
    ];

  if (items.length === 0) {
    return (
      <View
        style={{
          minHeight: 126,
          borderRadius: 16,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 22,
        }}
      >
        <Ionicons name="calendar-clear-outline" size={32} color={colors.oliveLight} />
        <Text
          style={{
            marginTop: 10,
            textAlign: 'center',
            fontFamily: 'Livvic_600SemiBold',
            fontSize: 16,
            color: colors.olive,
          }}
        >
          Nenhuma anotação para este dia
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: compact ? 10 : 16 }}>
      {items.map((item) => {
        const selected = selectedIds.includes(item.id);
        return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.75}
          onPress={() => selectable && onToggleNote?.(item.id)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: compact ? 10 : 18,
            paddingVertical: selectable ? 8 : 0,
            borderRadius: 14,
            backgroundColor: selected ? '#ECE2D6' : 'transparent',
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: selectable ? 9 : 0,
              borderWidth: selectable ? 2 : 0,
              borderColor: selected ? colors.olive : colors.oliveLight,
              backgroundColor: selected ? colors.olive : colors.oliveLight,
              marginRight: compact ? 44 : 42,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selected && <Ionicons name="checkmark" size={13} color={colors.white} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Livvic_700Bold',
                fontSize: compact ? 16 : 17,
                color: colors.oliveDark,
              }}
              numberOfLines={1}
            >
              {item.title}
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
              {compact ? item.duration.replace(' ', '\n') : item.duration}
            </Text>
          </View>
          <Ionicons
            name={selectable ? (selected ? 'checkmark-circle' : 'ellipse-outline') : 'chevron-forward'}
            size={28}
            color={colors.olive}
          />
        </TouchableOpacity>
        );
      })}
    </View>
  );
}

const recordImages = [
  require('../assets/images/lichia1.png'),
  require('../assets/images/lichia5.jpg'),
];

export function RecordCard({ index = 0 }: { index?: number }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        minHeight: 98,
        borderRadius: 14,
        backgroundColor: colors.white,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      <Image
        source={recordImages[index % recordImages.length]}
        style={{ width: 94, height: 68, borderRadius: 12 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, paddingLeft: 16 }}>
        <Text style={{ fontFamily: 'Livvic_400Regular', fontSize: 18, color: colors.text }}>
          Registro 1
        </Text>
        <Text
          style={{
            fontFamily: 'Livvic_400Regular',
            fontSize: 15,
            color: colors.muted,
            marginTop: 7,
          }}
          numberOfLines={1}
        >
          Primeira colheita do dia
        </Text>
        <Text
          style={{
            fontFamily: 'Livvic_400Regular',
            fontSize: 15,
            color: colors.olive,
            marginTop: 12,
          }}
        >
          01/06/26 - 6h 30min
        </Text>
      </View>
      <Ionicons name="heart" size={24} color="#FF4B4B" />
    </TouchableOpacity>
  );
}

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function buildCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      date,
      key: toDateKey(date),
      day: date.getDate(),
      outside: date.getMonth() !== monthDate.getMonth(),
    };
  });
}

export function CalendarPanel({
  monthDate = new Date(),
  selectedDate = new Date(),
  markedDates = [],
  onSelectDate,
  onMonthChange,
}: {
  monthDate?: Date;
  selectedDate?: Date;
  markedDates?: string[];
  onSelectDate?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}) {
  const days = buildCalendarDays(monthDate);
  const selectedKey = toDateKey(selectedDate);

  function changeMonth(amount: number) {
    onMonthChange?.(new Date(monthDate.getFullYear(), monthDate.getMonth() + amount, 1));
  }

  return (
    <View
      style={{
        marginHorizontal: 10,
        marginTop: 28,
        borderRadius: 22,
        backgroundColor: colors.cream,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 11,
        elevation: 8,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 16,
          marginBottom: 22,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => changeMonth(-1)}
          style={{
            width: 46,
            height: 46,
            borderRadius: 15,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Livvic_700Bold', fontSize: 22, color: colors.text }}>
          {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => changeMonth(1)}
          style={{
            width: 46,
            height: 46,
            borderRadius: 15,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-forward" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
          <Text
            key={day}
            style={{
              width: 38,
              textAlign: 'center',
              fontFamily: 'Livvic_400Regular',
              fontSize: 18,
              color: '#787983',
            }}
          >
            {day}
          </Text>
        ))}
      </View>

      {Array.from({ length: 6 }, (_, weekIndex) => (
        <View
          key={weekIndex}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: weekIndex === 5 ? 0 : 10,
          }}
        >
          {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => {
            const selected = day.key === selectedKey;
            const marked = markedDates.includes(day.key);

            return (
              <TouchableOpacity
                key={day.key}
                activeOpacity={0.75}
                onPress={() => onSelectDate?.(day.date)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: day.outside ? 6 : 21,
                  backgroundColor: selected ? '#CB0050' : colors.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: day.outside ? 0.8 : 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Livvic_400Regular',
                    fontSize: 18,
                    color: selected ? colors.white : day.outside ? '#AAAAAE' : colors.text,
                  }}
                >
                  {day.day}
                </Text>
                {marked && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 5,
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: selected ? colors.white : colors.red,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
