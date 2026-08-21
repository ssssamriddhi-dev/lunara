import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import CycleScreen from '../screens/CycleScreen';
import LearnScreen from '../screens/LearnScreen';
import MoveScreen from '../screens/MoveScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: '🌙',
  Cycle: '◍',
  Learn: '✦',
  Move: '❋',
  Profile: '☾',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.ink,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 88,
            paddingTop: 8,
          },
          tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>{ICONS[route.name]}</Text>
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Cycle" component={CycleScreen} />
        <Tab.Screen name="Learn" component={LearnScreen} />
        <Tab.Screen name="Move" component={MoveScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
