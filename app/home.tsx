import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F8F2EB" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FAIXA VERMELHA */}
        <View
          style={{
            height: 55,
            backgroundColor: "#C2193D",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <Image
            source={require("../assets/images/mb-bege.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </View>

        {/* CONTEÚDO */}
        <View style={{ paddingHorizontal: 28, paddingTop: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Livvic_700Bold",
                  fontSize: 30,
                  color: "#2B2B2B",
                }}
              >
                Olá, Usuário!
              </Text>

              <Text
                style={{
                  fontFamily: "Livvic_400Regular",
                  fontSize: 22,
                  color: "#8A8A8A",
                  marginTop: 4,
                }}
              >
                Bem Vindo ao Mobo!
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 62,
                height: 62,
                borderRadius: 18,
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={32}
                color="#2B2B2B"
              />
            </TouchableOpacity>
          </View>

          {/* PESQUISA */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 34,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 64,
                borderRadius: 22,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 18,
              }}
            >
              <Ionicons name="search-outline" size={32} color="#B5B5B5" />
              <TextInput
                placeholder="Pesquisar...."
                placeholderTextColor="#B5B5B5"
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontFamily: "Livvic_400Regular",
                  fontSize: 22,
                  color: "#2B2B2B",
                }}
              />
            </View>

            <TouchableOpacity
              style={{
                width: 64,
                height: 64,
                borderRadius: 22,
                backgroundColor: "#8A122D",
                marginLeft: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="options-outline" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 180,
              borderRadius: 14,
              backgroundColor: "#B9B88A",
              marginBottom: 28,
              overflow: "hidden",
              position: "relative",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* TEXTO */}
            <View
              style={{
                position: "absolute",
                left: 28,
                top: 24,
                zIndex: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: "Livvic_Medium",
                  fontSize: 20,
                  color: "#2E321E",
                }}
              >
                Conheça o
              </Text>

              <Text
                style={{
                  fontFamily: "Livvic_900Black",
                  fontSize: 32,
                  color: "#383D22",
                  marginTop: 2,
                }}
              >
                MOBO!
              </Text>

              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: "#8C8A5C",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 7,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Livvic_600SemiBold",
                    fontSize: 16,
                    color: "#F8F2EB",
                  }}
                >
                  Saiba Mais
                </Text>
              </TouchableOpacity>
            </View>

            {/* IMAGEM */}
            <Image
              source={require("../assets/images/robo-home.png")}
              style={{
                position: "absolute",
                right: -2,
                bottom: 0,
                width: 285,
                height: 160,
              }}
              resizeMode="contain"
            />
          </View>

          {/* TÍTULO FERRAMENTAS */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Livvic_700Bold",
                fontSize: 22,
                color: "#2B2B2B",
              }}
            >
              Ferramentas
            </Text>
          </View>
          {/* CARDS FERRAMENTAS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 30,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/previsao-de-colheita")}
              style={{
                width: 220,
                backgroundColor: "#FFFFFF",
                borderRadius: 15,
                padding: 16,
                marginRight: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              {/* IMAGEM */}
              <View
                style={{
                  height: 120,
                  borderRadius: 16,
                  backgroundColor: "#A7A574",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={require("../assets/images/calendario.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />

                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#3E4A2B",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="heart-outline" size={18} color="#FFFFFF" />
                </View>
              </View>

              {/* TÍTULO */}
              <Text
                style={{
                  fontFamily: "Livvic_700Bold",
                  fontSize: 18,
                  color: "#2B2B2B",
                }}
              >
                Colheita do dia
              </Text>

              {/* SUBTÍTULO */}
              <Text
                style={{
                  fontFamily: "Livvic_400Regular",
                  fontSize: 16,
                  color: "#A7A574",
                  marginTop: 4,
                }}
              >
                Anotações
              </Text>

              {/* TEMPO */}
              <View
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  backgroundColor: "#F2D6DC",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="time-outline" size={16} color="#2B2B2B" />

                  <Text
                    style={{
                      fontFamily: "Livvic_600SemiBold",
                      fontSize: 14,
                      color: "#2B2B2B",
                      marginLeft: 6,
                    }}
                  >
                    6h 30min
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/previsao-de-colheita")}
              style={{
                width: 220,
                backgroundColor: "#FFFFFF",
                borderRadius: 15,
                padding: 16,
                marginRight: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              {/* IMAGEM */}
              <View
                style={{
                  height: 120,
                  borderRadius: 16,
                  backgroundColor: "#A7A574",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={require("../assets/images/game.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>

              {/* TÍTULO */}
              <Text
                style={{
                  fontFamily: "Livvic_700Bold",
                  fontSize: 18,
                  color: "#2B2B2B",
                }}
              >
                Controle - Braço
              </Text>

              {/* SUBTÍTULO */}
              <Text
                style={{
                  fontFamily: "Livvic_400Regular",
                  fontSize: 16,
                  color: "#A7A574",
                  marginTop: 4,
                }}
              >
                Câmera / Mapa
              </Text>

              {/* TEMPO */}
              <View
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  backgroundColor: "#F2D6DC",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="time-outline" size={16} color="#2B2B2B" />

                  <Text
                    style={{
                      fontFamily: "Livvic_600SemiBold",
                      fontSize: 14,
                      color: "#2B2B2B",
                      marginLeft: 6,
                    }}
                  >
                    8h 30min
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
