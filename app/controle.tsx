import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  Vibration,
} from 'react-native';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export default function Controle() {
  const ROBOT_WS_URL = 'ws://192.168.4.1:81';
  const leftJoystick = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const rightJoystick = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const cameraDrift = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const leftScale = useRef(new Animated.Value(1)).current;
  const rightScale = useRef(new Animated.Value(1)).current;
  const focusPulse = useRef(new Animated.Value(1)).current;
  const focusOpacity = useRef(new Animated.Value(0.75)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;

  const sliderY = useRef(new Animated.Value(0)).current;
  const lastGarraCommand = useRef('');
  const lastEsteiraCommand = useRef('');
  const lastSliderCommand = useRef('');
  const wsRef = useRef<WebSocket | null>(null);
  const isWsConnected = useRef(false);

  const [garraCommand, setGarraCommand] = useState('Garra parada');
  const [esteiraCommand, setEsteiraCommand] = useState('Esteira parada');
  const [sliderValue, setSliderValue] = useState(50);
  const [connectionStatus, setConnectionStatus] = useState<
    'offline' | 'connecting' | 'online'
  >('offline');

  const focoPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [detectionResult, setDetectionResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const leftPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        Haptics.selectionAsync();
        Vibration.vibrate(40);

        Animated.spring(leftScale, {
          toValue: 0.88,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: (_, gesture) => {
        const maxDistance = 28;
        const x = Math.max(-maxDistance, Math.min(gesture.dx, maxDistance));
        const y = Math.max(-maxDistance, Math.min(gesture.dy, maxDistance));

        leftJoystick.setValue({ x, y });

        let direction = 'parada';

        if (Math.abs(x) > Math.abs(y)) {
          if (x > 10) direction = 'direita';
          else if (x < -10) direction = 'esquerda';
        } else {
          if (y > 10) direction = 'baixo';
          else if (y < -10) direction = 'cima';
        }

        setGarraCommand(`Garra: ${direction}`);

        const command = getDirectionCommand('garra', direction);

        if (command !== lastGarraCommand.current) {
          sendRobotCommand(command);
          lastGarraCommand.current = command;
        }
      },

      onPanResponderRelease: () => {
        setGarraCommand('Garra parada');

        const command = getDirectionCommand('garra', 'parada');

        if (command !== lastGarraCommand.current) {
          sendRobotCommand(command);
          lastGarraCommand.current = command;
        }

        Animated.spring(leftScale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();

        Animated.spring(leftJoystick, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const rightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        Haptics.selectionAsync();
        Vibration.vibrate(40);

        Animated.spring(rightScale, {
          toValue: 0.88,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: (_, gesture) => {
        const maxDistance = 28;
        const x = Math.max(-maxDistance, Math.min(gesture.dx, maxDistance));
        const y = Math.max(-maxDistance, Math.min(gesture.dy, maxDistance));

        rightJoystick.setValue({ x, y });

        let direction = 'parada';

        if (Math.abs(x) > Math.abs(y)) {
          if (x > 10) direction = 'direita';
          else if (x < -10) direction = 'esquerda';
        } else {
          if (y > 10) direction = 'ré';
          else if (y < -10) direction = 'frente';
        }

        setEsteiraCommand(`Esteira: ${direction}`);

        const command = getDirectionCommand('esteira', direction);

        if (command !== lastEsteiraCommand.current) {
          sendRobotCommand(command);
          lastEsteiraCommand.current = command;
        }
      },

      onPanResponderRelease: () => {
        setEsteiraCommand('Esteira parada');

        const command = getDirectionCommand('esteira', 'parada');

        if (command !== lastEsteiraCommand.current) {
          sendRobotCommand(command);
          lastEsteiraCommand.current = command;
        }

        Animated.spring(rightScale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();

        Animated.spring(rightJoystick, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const sliderPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        Vibration.vibrate(30);
      },

      onPanResponderMove: (_, gesture) => {
        const max = 34;
        const y = Math.max(-max, Math.min(gesture.dy, max));

        sliderY.setValue(y);

        const percent = Math.round(50 - (y / max) * 50);
        const nextSliderValue = Math.max(0, Math.min(100, percent));
        let command = 'garra_neutra';

        if (nextSliderValue > 60) command = 'abrir_garra';
        else if (nextSliderValue < 40) command = 'fechar_garra';

        setSliderValue(nextSliderValue);

        if (command !== lastSliderCommand.current) {
          sendRobotCommand(command);
          lastSliderCommand.current = command;
        }
      },

      onPanResponderRelease: () => {
        Vibration.vibrate(30);
      },
    })
  ).current;

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      connectRobotSocket();

      return () => {
        
          <Stack.Screen options={{ headerShown: false }} />
          ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
          disconnectRobotSocket();
      };
    }, [])
          );

  useEffect(() => {
    const cameraLoop = Animated.loop(
          Animated.sequence([
          Animated.timing(cameraDrift, {
            toValue: {x: 5, y: -3 },
          duration: 5800,
          useNativeDriver: false,
        }),
          Animated.timing(cameraDrift, {
            toValue: {x: -4, y: 4 },
          duration: 6000,
          useNativeDriver: false,
        }),
          Animated.timing(cameraDrift, {
            toValue: {x: 0, y: 0 },
          duration: 4900,
          useNativeDriver: false,
        }),
          ])
          );

          const focusLoop = Animated.loop(
          Animated.parallel([
          Animated.sequence([
          Animated.timing(focusPulse, {
            toValue: 1.025,
          duration: 1100,
          useNativeDriver: false,
          }),
          Animated.timing(focusPulse, {
            toValue: 1,
          duration: 1100,
          useNativeDriver: false,
          }),
          ]),
          Animated.sequence([
          Animated.timing(focusOpacity, {
            toValue: 1,
          duration: 1100,
          useNativeDriver: false,
          }),
          Animated.timing(focusOpacity, {
            toValue: 0.85,
          duration: 1100,
          useNativeDriver: false,
          }),
          ]),
          ])
          );

          cameraLoop.start();
          focusLoop.start();

    return () => {
            cameraLoop.stop();
          focusLoop.stop();
    };
  }, [cameraDrift, focusOpacity, focusPulse]);

          async function handleUpload() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (!permission.granted) {
            Alert.alert(
              'Permissão necessária',
              'Permita acesso à galeria para escolher uma imagem.'
            );
          return;
    }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
          quality: 1,
    });

          if (!result.canceled) {
            Alert.alert('Imagem selecionada', 'Upload preparado com sucesso.');
    }
  }

          function sendRobotCommand(command: string) {
            console.log('[MOBO COMMAND]', command);

          if (
          isWsConnected.current &&
          wsRef.current?.readyState === WebSocket.OPEN
          ) {
            wsRef.current.send(
              JSON.stringify({
                command,
                timestamp: Date.now(),
              })
            );
          return;
    }

          console.log('[MOBO WS MOCK]', command);
  }

          function connectRobotSocket() {
    if (
          isWsConnected.current ||
          wsRef.current?.readyState === WebSocket.CONNECTING
          ) {
      return;
    }

          setConnectionStatus('connecting');

          const socket = new WebSocket(ROBOT_WS_URL);
          wsRef.current = socket;

    socket.onopen = () => {
            setConnectionStatus('online');
          isWsConnected.current = true;
          console.log('[MOBO WS] conectado');
    };

    socket.onmessage = (event) => {
            console.log('[MOBO WS MESSAGE]', event.data);
    };

    socket.onerror = (error) => {
            console.log('[MOBO WS ERROR]', error);
          setConnectionStatus('offline');
          isWsConnected.current = false;
    };

    socket.onclose = () => {
            console.log('[MOBO WS] desconectado');
          setConnectionStatus('offline');
          isWsConnected.current = false;
          wsRef.current = null;
    };
  }

          function disconnectRobotSocket() {
    if (wsRef.current) {
            wsRef.current.close();
    }

          wsRef.current = null;
          isWsConnected.current = false;
          setConnectionStatus('offline');
  }

          function getDirectionCommand(prefix: string, direction: string) {
    const normalizedDirection = direction === 'ré' ? 're' : direction;

          return `${prefix}_${normalizedDirection}`;
  }

          function simulateDetection() {
            sendRobotCommand('camera_scan_start');
          setIsScanning(true);
          setDetectionResult('');
          resultOpacity.setValue(0);

          Animated.sequence([
          Animated.timing(focoPosition, {
            toValue: {x: -120, y: -40 },
          duration: 700,
          useNativeDriver: false,
      }),
          Animated.timing(focoPosition, {
            toValue: {x: 90, y: -20 },
          duration: 700,
          useNativeDriver: false,
      }),
          Animated.timing(focoPosition, {
            toValue: {x: 60, y: 70 },
          duration: 700,
          useNativeDriver: false,
      }),
          Animated.timing(focoPosition, {
            toValue: {x: 0, y: 0 },
          duration: 700,
          useNativeDriver: false,
      }),
    ]).start(() => {
            setDetectionResult('Lichia madura');

          Animated.sequence([
          Animated.timing(resultOpacity, {
            toValue: 1,
          duration: 280,
          useNativeDriver: false,
        }),
          Animated.delay(2600),
          Animated.timing(resultOpacity, {
            toValue: 0,
          duration: 360,
          useNativeDriver: false,
        }),
      ]).start(() => {
            setDetectionResult('');
          setIsScanning(false);
          sendRobotCommand('camera_scan_complete');
      });
    });
  }

          return (
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            <AnimatedImageBackground
              source={require('../assets/images/controle-bg.png')}
              style={{
                position: 'absolute',
                top: -4,
                left: -6,
                right: -6,
                bottom: -4,
                transform: [
                  { translateX: cameraDrift.x },
                  { translateY: cameraDrift.y },
                ],
              }}
              resizeMode="cover"
            />

            <View style={{ flex: 1, width: '100%', height: '100%' }}>
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.30)',
                }}
              />

              <TouchableOpacity
                onPress={() => router.replace('/home')}
                style={{
                  position: 'absolute',
                  top: 22,
                  left: 20,
                  width: 30,
                  height: 30,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255,255,255,0.14)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.65)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 30,
                }}
              >
                <Ionicons name="chevron-back" size={27} color="#FFFFFF" />
              </TouchableOpacity>

              {/* STATUS DISCRETOS */}
              <View
                style={{
                  position: 'absolute',
                  left: 86,
                  top: 26,
                  backgroundColor: 'rgba(0,0,0,0.30)',
                  paddingHorizontal: 11,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.12)',
                  zIndex: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Livvic_600SemiBold',
                    fontSize: 12,
                    color: '#FFFFFF',
                  }}
                >
                  {garraCommand}
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  top: 26,
                  backgroundColor:
                    connectionStatus === 'online'
                      ? 'rgba(76,175,80,0.35)'
                      : connectionStatus === 'connecting'
                        ? 'rgba(255,193,7,0.35)'
                        : 'rgba(255,45,85,0.35)',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.12)',
                  zIndex: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Livvic_600SemiBold',
                    fontSize: 11,
                    color: '#FFFFFF',
                  }}
                >
                  {connectionStatus === 'online'
                    ? 'Robô online'
                    : connectionStatus === 'connecting'
                      ? 'Conectando...'
                      : 'Robô offline'}
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  right: 112,
                  top: 26,
                  backgroundColor: 'rgba(0,0,0,0.30)',
                  paddingHorizontal: 11,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.12)',
                  zIndex: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Livvic_600SemiBold',
                    fontSize: 12,
                    color: '#FFFFFF',
                  }}
                >
                  {esteiraCommand}
                </Text>
              </View>

              {/* HUD LOCALIZAÇÃO */}
              <View
                style={{
                  position: 'absolute',
                  top: 82,
                  left: 40,
                  width: 45,
                  height: 45,
                  borderRadius: 30,
                  borderWidth: 1.4,
                  borderColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  zIndex: 10,
                }}
              >
                <Ionicons name="location-outline" size={30} color="#FFFFFF" />
              </View>

              {/* HUD ROTAÇÃO DA CÂMERA */}
              <Image
                source={require('../assets/images/rotacao-camera.png')}
                style={{
                  position: 'absolute',
                  top: 110,
                  left: 15,
                  width: 155,
                  height: 155,
                  resizeMode: 'contain',
                  zIndex: 10,
                }}
              />

              {/* SLIDER DIREITO  ABRIE E FECHAR GARRA */}
              <View
                style={{
                  position: 'absolute',
                  top: 82,
                  right: 28,
                  width: 38,
                  height: 128,
                  borderRadius: 20,
                  borderWidth: 1.2,
                  borderColor: 'rgba(255,255,255,0.75)',
                  backgroundColor: 'rgba(0,0,0,0.18)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 18,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 82,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                  }}
                />

                <Animated.View
                  {...sliderPanResponder.panHandlers}
                  style={{
                    position: 'absolute',
                    top: 44,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#FF2D55',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 9,
                    elevation: 10,
                    transform: [{ translateY: sliderY }],
                  }}
                >
                  <Image
                    source={require('../assets/images/BtnabreFecha.png')}
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                    }}
                  />
                </Animated.View>

                <Text
                  style={{
                    position: 'absolute',
                    bottom: -22,
                    color: '#FFFFFF',
                    fontFamily: 'Livvic_700Bold',
                    fontSize: 11,
                  }}
                >
                  {sliderValue}%
                </Text>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View
                  style={{
                    width: 120,
                    height: 120,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [
                      { translateX: focoPosition.x },
                      { translateY: focoPosition.y },
                    ],
                  }}
                >
                  <Animated.View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      width: 96,
                      height: 96,
                      borderRadius: 48,
                      backgroundColor: isScanning
                        ? 'rgba(255,45,85,0.28)'
                        : 'rgba(255,45,85,0.16)',
                      opacity: focusOpacity,
                      shadowColor: '#FF2D55',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: isScanning ? 1 : 0.75,
                      shadowRadius: isScanning ? 22 : 14,
                      elevation: isScanning ? 16 : 10,
                      transform: [{ scale: focusPulse }],
                    }}
                  />

                  <Animated.Image
                    source={require('../assets/images/foco.png')}
                    style={{
                      width: 120,
                      height: 120,
                      resizeMode: 'contain',
                      opacity: focusOpacity,
                      transform: [{ scale: focusPulse }],
                    }}
                  />

                  {isScanning && detectionResult === '' && (
                    <Text
                      style={{
                        position: 'absolute',
                        top: 104,
                        width: 112,
                        fontFamily: 'Livvic_600SemiBold',
                        fontSize: 10,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        textShadowColor: '#FF2D55',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 6,
                      }}
                    >
                      IA analisando...
                    </Text>
                  )}

                  {detectionResult !== '' && (
                    <Animated.View
                      style={{
                        position: 'absolute',
                        top: 96,
                        width: 116,
                        paddingVertical: 6,
                        borderRadius: 10,
                        backgroundColor: 'rgba(0,0,0,0.58)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,45,85,0.42)',
                        alignItems: 'center',
                        opacity: resultOpacity,
                        shadowColor: '#FF2D55',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: 8,
                        elevation: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Livvic_700Bold',
                          fontSize: 11,
                          color: '#FFFFFF',
                          textAlign: 'center',
                        }}
                      >
                        {detectionResult}
                      </Text>
                      <Text
                        style={{
                          marginTop: 1,
                          fontFamily: 'Livvic_600SemiBold',
                          fontSize: 9,
                          color: 'rgba(255,255,255,0.82)',
                          textAlign: 'center',
                        }}
                      >
                        Confiança IA: 96%
                      </Text>
                    </Animated.View>
                  )}
                </Animated.View>

                {/* JOYSTICK ESQUERDO */}
                <View
                  style={{
                    position: 'absolute',
                    left: 30,
                    bottom: 40,
                    width: 110,
                    height: 110,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={require('../assets/images/joystick-esquerdo.png')}
                    style={{
                      width: 110,
                      height: 110,
                      resizeMode: 'contain',
                      position: 'absolute',
                    }}
                  />

                  <Animated.View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: 'rgba(255,45,85,0.28)',
                      shadowColor: '#FF2D55',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 1,
                      shadowRadius: 16,
                      elevation: 8,
                      transform: [
                        { translateX: leftJoystick.x },
                        { translateY: leftJoystick.y },
                      ],
                    }}
                  />

                  <Animated.View
                    {...leftPanResponder.panHandlers}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,45,85,0.18)',
                      shadowColor: '#FF2D55',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.9,
                      shadowRadius: 10,
                      elevation: 10,
                      transform: [
                        { translateX: leftJoystick.x },
                        { translateY: leftJoystick.y },
                        { scale: leftScale },
                      ],
                    }}
                  >
                    <Ionicons name="finger-print" size={28} color="#FFFFFF" />
                  </Animated.View>
                </View>

                {/* JOYSTICK DIREITO */}
                <View
                  style={{
                    position: 'absolute',
                    right: 30,
                    bottom: 40,
                    width: 110,
                    height: 110,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={require('../assets/images/joystick-direito.png')}
                    style={{
                      width: 110,
                      height: 110,
                      resizeMode: 'contain',
                      position: 'absolute',
                    }}
                  />

                  <Animated.View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: 'rgba(255,45,85,0.28)',
                      shadowColor: '#FF2D55',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 1,
                      shadowRadius: 16,
                      elevation: 8,
                      transform: [
                        { translateX: rightJoystick.x },
                        { translateY: rightJoystick.y },
                      ],
                    }}
                  />

                  <Animated.View
                    {...rightPanResponder.panHandlers}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,45,85,0.18)',
                      shadowColor: '#FF2D55',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.9,
                      shadowRadius: 10,
                      elevation: 10,
                      transform: [
                        { translateX: rightJoystick.x },
                        { translateY: rightJoystick.y },
                        { scale: rightScale },
                      ],
                    }}
                  >
                    <Ionicons name="finger-print" size={28} color="#FFFFFF" />
                  </Animated.View>
                </View>

                {/* PAINEL INFERIOR DO FIGMA */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    alignSelf: 'center',
                    width: 270,
                    height: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 15,
                  }}
                >
                  <Image
                    source={require('../assets/images/painel-controle.png')}
                    style={{
                      position: 'absolute',
                      width: 270,
                      height: 64,
                      resizeMode: 'contain',
                    }}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 30,
                      marginTop: 0,
                    }}
                  >
                    <TouchableOpacity onPress={simulateDetection}>
                      <Image
                        source={require('../assets/images/camera.png')}
                        style={{ width: 48, height: 48, resizeMode: 'contain' }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/calendario')}>
                      <Image
                        source={require('../assets/images/calend.png')}
                        style={{ width: 48, height: 48, resizeMode: 'contain' }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleUpload}>
                      <Image
                        source={require('../assets/images/uploads.png')}
                        style={{ width: 48, height: 48, resizeMode: 'contain' }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </View>
          </View>
          );
}
