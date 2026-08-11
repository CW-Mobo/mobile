import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import api from "../config/api";
import { getToken } from "../config/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#6e0026",
        }}
      >
        <ActivityIndicator size="large" color="#ECE2D6" />
      </View>
    );
  }

  return <Redirect href={authenticated ? "/home" : "/login"} />;
}
