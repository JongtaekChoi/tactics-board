import "./src/i18n"; // i18n 초기화

import { BoardProvider } from "./src/contexts/BoardContext";
import BoardScreen from "./src/screens/BoardScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./src/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { RootStackParamList } from "./src/types/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TeamEditScreen from "./src/screens/TeamEditScreen";
// v1.1.0 팀 관리 화면들
import TeamListScreen from "./src/screens/TeamListScreen";
import TeamSetupScreen from "./src/screens/TeamSetupScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BoardProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "#111" },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="TeamSetup" component={TeamSetupScreen} />
              <Stack.Screen name="Board" component={BoardScreen} />
              <Stack.Screen
                name="TeamList"
                component={TeamListScreen}
                options={{
                  headerShown: true,
                  headerTitle: "팀 관리",
                  headerStyle: { backgroundColor: "#1a1a1a" },
                  headerTintColor: "#fff",
                }}
              />
              <Stack.Screen
                name="TeamEdit"
                component={TeamEditScreen}
                options={({ route }) => ({
                  headerShown: true,
                  headerTitle: route.params?.teamId
                    ? "팀 편집"
                    : "새 팀 만들기",
                  headerStyle: { backgroundColor: "#1a1a1a" },
                  headerTintColor: "#fff",
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </BoardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
