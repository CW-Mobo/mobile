
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function NotificationsSidebar({
  visible,
  onClose,
}: Props) {
  const { width, height } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.92, 420);
  const slideX = useRef(new Animated.Value(panelWidth)).current;

  useEffect(() => {
    if (visible) {
      slideX.setValue(panelWidth);

      Animated.timing(slideX, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, panelWidth, slideX]);

  function closeSidebar() {
    Animated.timing(slideX, {
      toValue: panelWidth,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeSidebar}
    >
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <Pressable
          onPress={closeSidebar}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.62)",
          }}
        />

        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: panelWidth,
            height,
            paddingTop: 24,
            backgroundColor: "#810C29",
            transform: [{ translateX: slideX }],
            elevation: 16,
            shadowColor: "#000",
            shadowOffset: { width: -4, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
          }}
        >
          {/* Cabeçalho */}
          <View
            style={{
              height: 80,
              paddingHorizontal: 22,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Livvic_700Bold",
                fontSize: 20,
                color: "#FFFFFF",
              }}
            >
              Notificações
            </Text>

            <TouchableOpacity
              onPress={closeSidebar}
              activeOpacity={0.75}
              hitSlop={10}
              accessibilityLabel="Fechar notificações"
              style={{
                width: 42,
                height: 42,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="close"
                size={42}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Notificação */}
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => {
              // Adicione aqui a ação ao abrir a notificação.
            }}
            style={{
            minHeight: 62,
            marginHorizontal: 12, // distância das laterais do menu
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 15,
            backgroundColor: "#C2193D",
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.24,
            shadowRadius: 4,
            elevation: 5,
            }}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Livvic_700Bold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                Mensagem não lida
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Livvic_400Regular",
                  fontSize: 15,
                  color: "#E9A1B0",
                  marginTop: 2,
                }}
              >
                Atenção ao clima...
              </Text>
            </View>

            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 13,
                backgroundColor: "#F8F2EB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Livvic_400Regular",
                  fontSize: 14,
                  color: "#810C29",
                }}
              >
                1
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
