import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { TopBrandBar, colors } from '../components/mobo-ui';

const lichiaImages: ImageSourcePropType[] = [
    require('../assets/images/lichia6.jpeg'),
    require('../assets/images/lichia2.png'),
    require('../assets/images/lichia3.jpg'),
    require('../assets/images/lichia4.jpeg'),
    require('../assets/images/lichia5.jpg'),
    require('../assets/images/lichia1.png'),
];

const records = [
    {
        id: 1,
        title: 'Registro 1',
        subtitle: 'Primeira colheita do dia',
        date: '01/06/26 - 6h 30min',
        image: lichiaImages[0],
    },
    {
        id: 2,
        title: 'Registro 2',
        subtitle: 'Primeira colheita do dia',
        date: '01/06/26 - 6h 30min',
        image: lichiaImages[1],
    },
    {
        id: 3,
        title: 'Registro 3',
        subtitle: 'Primeira colheita do dia',
        date: '01/06/26 - 6h 30min',
        image: lichiaImages[2],
    },
    {
        id: 4,
        title: 'Registro 4',
        subtitle: 'Primeira colheita do dia',
        date: '01/06/26 - 6h 30min',
        image: lichiaImages[3],
    },
    {
        id: 5,
        title: 'Registro 5',
        subtitle: 'Primeira colheita do dia',
        date: '01/06/26 - 6h 30min',
        image: lichiaImages[4],
    },
    {
        id: 6,
        title: 'Registro 6',
        subtitle: 'Primeira colheita do dia',
        date: '01/06/26 - 6h 30min',
        image: lichiaImages[5],
    },
];

export default function Registros() {
    return (
        <View style={{ flex: 1, backgroundColor: colors.cream }}>
            <TopBrandBar />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 26,
                    paddingBottom: 110,
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
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
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

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={{
                            width: 46,
                            height: 46,
                            borderRadius: 16,
                            backgroundColor: colors.white,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="notifications-outline" size={26} color={colors.text} />

                        <View
                            style={{
                                position: 'absolute',
                                top: 14,
                                right: 12,
                                width: 9,
                                height: 9,
                                borderRadius: 5,
                                backgroundColor: colors.red,
                            }}
                        />
                    </TouchableOpacity>
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

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 16,
                            backgroundColor: colors.wine,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="options-outline" size={26} color={colors.white} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 14,
                        backgroundColor: colors.oliveLight,
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        marginBottom: 18,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Livvic_700Bold',
                            fontSize: 17,
                            color: colors.white,
                        }}
                    >
                        Hoje
                    </Text>

                    <Ionicons
                        name="close"
                        size={20}
                        color={colors.white}
                        style={{ marginLeft: 8 }}
                    />
                </TouchableOpacity>

                {records.map((record) => (
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
        </View>
    );
}