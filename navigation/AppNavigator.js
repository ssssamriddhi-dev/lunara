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

const TAB_TINTS = {
  Home: COLORS.rose,
  Cycle: COLORS.terracotta,
  Learn: COLORS.sky,
  Move: COLORS.sage,
  Profile: COLORS.plum,
};

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
          tabBarActiveTintColor: TAB_TINTS[route.name] || COLORS.orchid,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: 'rgba(255,255,255,0.94)',
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
