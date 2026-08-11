import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import {
  CalendarPanel,
  CalendarNote,
  NoteList,
  SectionTabs,
  TopBrandBar,
  colors,
} from '../components/mobo-ui';

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

const initialNotes: CalendarNote[] = [
  {
    id: 'note-2026-06-01-1',
    title: 'Primeira colheita do mês',
    duration: '04:28 min',
    date: '2026-06-01',
  },
  {
    id: 'note-2026-06-01-2',
    title: 'Revisão dos registros',
    duration: '06:12 min',
    date: '2026-06-01',
  },
  {
    id: 'note-2026-07-29-1',
    title: 'Primeira colheita do mês',
    duration: '43:58 min',
    date: '2026-07-29',
  },
];

export default function Calendario() {
  const today = useMemo(() => new Date(), []);
  const [monthDate, setMonthDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [notes, setNotes] = useState(initialNotes);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);

  const selectedDateKey = toDateKey(selectedDate);
  const selectedNotes = notes.filter((note) => note.date === selectedDateKey);
  const markedDates = Array.from(new Set(notes.map((note) => note.date)));

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setMonthDate(new Date(date.getFullYear(), date.getMonth(), 1));
    setSelectedNoteIds([]);
  }

  function handleAddNote() {
    const now = new Date();
    const note: CalendarNote = {
      id: `note-${selectedDateKey}-${now.getTime()}`,
      title: 'Nova anotação',
      duration: '00:00 min',
      date: selectedDateKey,
    };

    setNotes((currentNotes) => [note, ...currentNotes]);
  }

  function handleToggleSelection() {
    if (selectionMode && selectedNoteIds.length > 0) {
      setNotes((currentNotes) => currentNotes.filter((note) => !selectedNoteIds.includes(note.id)));
      setSelectedNoteIds([]);
      setSelectionMode(false);
      return;
    }

    setSelectionMode((current) => !current);
    setSelectedNoteIds([]);
  }

  function handleToggleNote(id: string) {
    setSelectedNoteIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <TopBrandBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 18 }}
      >
        <CalendarPanel
          monthDate={monthDate}
          selectedDate={selectedDate}
          markedDates={markedDates}
          onSelectDate={handleSelectDate}
          onMonthChange={setMonthDate}
        />

        <View style={{ paddingHorizontal: 26, paddingTop: 26 }}>
          <SectionTabs active="notes" />
          <Text
            style={{
              marginBottom: 16,
              paddingHorizontal: 8,
              fontFamily: 'Livvic_700Bold',
              fontSize: 18,
              color: colors.oliveDark,
            }}
          >
            {formatDate(selectedDate)}
          </Text>
          <NoteList
            notes={selectedNotes}
            selectable={selectionMode}
            selectedIds={selectedNoteIds}
            onToggleNote={handleToggleNote}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              marginTop: 26,
              paddingHorizontal: 8,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddNote}
              style={{
                width: 68,
                height: 52,
                borderRadius: 16,
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="add" size={34} color={colors.olive} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleToggleSelection}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                backgroundColor:
                  selectionMode && selectedNoteIds.length > 0 ? colors.red : colors.olive,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Livvic_700Bold',
                  fontSize: 19,
                  color: colors.white,
                }}
              >
                {selectionMode && selectedNoteIds.length > 0 ? 'Excluir' : selectionMode ? 'Cancelar' : 'Selecionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
