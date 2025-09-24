import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootStackParamList } from './src/types/navigation';
import HomeScreen from './src/screens/HomeScreen';
import TeamSetupScreen from './src/screens/TeamSetupScreen';
import BoardScreen from './src/screens/BoardScreen';
// v1.1.0 팀 관리 화면들
import TeamListScreen from './src/screens/TeamListScreen';
import TeamEditScreen from './src/screens/TeamEditScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#111' },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
          />
          <Stack.Screen 
            name="TeamSetup" 
            component={TeamSetupScreen}
          />
          <Stack.Screen
            name="Board"
            component={BoardScreen}
          />
          <Stack.Screen
            name="TeamList"
            component={TeamListScreen}
            options={{
              headerShown: true,
              headerTitle: '팀 관리',
              headerStyle: { backgroundColor: '#1a1a1a' },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen
            name="TeamEdit"
            component={TeamEditScreen}
            options={({ route }) => ({
              headerShown: true,
              headerTitle: route.params?.teamId ? '팀 편집' : '새 팀 만들기',
              headerStyle: { backgroundColor: '#1a1a1a' },
              headerTintColor: '#fff'
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}