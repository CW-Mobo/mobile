import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageSourcePropType,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { TopBrandBar } from '../components/TopBrandBar';
import { colors } from '../theme/colors';
import BottomNav from '../components/BottomNav';
import { fetchHarvests, type Harvest } from '../services/harvests';

const lichiaImages: ImageSourcePropType[] = [
    require('../assets/images/lichia6.jpeg'),
    require('../assets/images/lichia2.png'),
    require('../assets/images/lichia3.jpg'),
    require('../assets/images/lichia4.jpeg'),
    require('../assets/images/lichia5.jpg'),
    require('../assets/images/lichia1.png'),
];

export default function Registros() {
    const [harvests, setHarvests] = useState<Harvest[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadHarvests() {
            try {
                setHarvests(await fetchHarvests());
            } catch (requestError: any) {
                setError(requestError.response?.data?.message ?? 'Não foi possível carregar os registros.');
            } finally {
                setLoading(false);
            }
        }
        void loadHarvests();
    }, []);

    const records = useMemo(() => harvests
        .filter((harvest) => {
            const query = search.trim().toLocaleLowerCase('pt-BR');
            if (!query) return true;
            const plantingName = typeof harvest.planting === 'object'
                ? harvest.planting?.plantingName ?? ''
                : '';
            return `${plantingName} ${harvest.harvestedQuantity} ${new Date(harvest.harvestDate).toLocaleDateString('pt-BR')}`
                .toLocaleLowerCase('pt-BR')
                .includes(query);
        })
        .map((harvest, index) => {
            const date = new Date(harvest.harvestDate);
            const plantingName = typeof harvest.planting === 'object'
                ? harvest.planting?.plantingName
                : undefined;
            return {
                id: harvest._id,
                title: `${harvest.harvestedQuantity} unidades colhidas`,
                subtitle: plantingName ?? 'Colheita registrada',
                date: Number.isNaN(date.getTime()) ? 'Data não informada' : date.toLocaleDateString('pt-BR'),
                image: lichiaImages[index % lichiaImages.length],
            };
        }), [harvests, search]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.cream }}>
            <TopBrandBar />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 26,
                    paddingBottom: 130,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 24,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.replace('/home')}
                        >
                        <Ionicons name="chevron-back" size={32} color={colors.text} />
                        </TouchableOpacity>

                    <Text
                        style={{
                            fontFamily: 'Livvic_700Bold',
                            fontSize: 22,
                            color: colors.text,
                        }}
                    >
                        Registros
                    </Text>

                    <View style={{ width: 32 }} />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 48,
                            borderRadius: 16,
                            backgroundColor: colors.white,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 18,
                        }}
                    >
                        <Ionicons name="search-outline" size={26} color="#B4B4B4" />

                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Pesquisar...."
                            placeholderTextColor="#B4B4B4"
                            style={{
                                flex: 1,
                                marginLeft: 12,
                                fontFamily: 'Livvic_400Regular',
                                fontSize: 17,
                                color: colors.text,
                            }}
                        />
                    </View>

                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.red} style={{ marginTop: 32 }} />
                ) : error ? (
                    <Text style={{ textAlign: 'center', color: colors.red, marginVertical: 24 }}>{error}</Text>
                ) : records.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: colors.muted, marginVertical: 24 }}>
                        {harvests.length ? 'Nenhum registro corresponde à pesquisa.' : 'Nenhuma colheita registrada ainda.'}
                    </Text>
                ) : records.map((record) => (
                    <TouchableOpacity
                        key={record.id}
                        activeOpacity={0.85}
                        style={{
                            minHeight: 112,
                            borderRadius: 18,
                            backgroundColor: colors.white,
                            marginBottom: 14,
                            padding: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={record.image}
                            style={{
                                width: 112,
                                height: 90,
                                borderRadius: 14,
                            }}
                            resizeMode="cover"
                        />

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Livvic_700Bold',
                                    fontSize: 19,
                                    color: colors.text,
                                }}
                            >
                                {record.title}
                            </Text>

                            <Text
                                style={{
                                    fontFamily: 'Livvic_400Regular',
                                    fontSize: 16,
                                    color: colors.muted,
                                    marginTop: 7,
                                }}
                            >
                                {record.subtitle}
                            </Text>

                            <Text
                                style={{
                                    fontFamily: 'Livvic_400Regular',
                                    fontSize: 16,
                                    color: colors.olive,
                                    marginTop: 18,
                                }}
                            >
                                {record.date}
                            </Text>
                        </View>

                        <Ionicons name="heart" size={25} color="#FF4B4B" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <BottomNav />
    </View>
    </View>
    );
}
