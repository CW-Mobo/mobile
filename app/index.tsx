import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { getToken } from "../config/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        setAuthenticated(!!token);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const timer = setTimeout(() => {
      setSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Mostra o splash durante 2 segundos
  if (splash) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require("../assets/images/splash.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Depois dos 2 segundos, espera a verificação do login
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#6e0026",
        }}
      />
    );
  }

  return <Redirect href={authenticated ? "/home" : "/login"} />;
}