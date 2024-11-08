import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native'; // Import Image

export default function TabLayout() {
  const icons = {
    chats: require('@/assets/images/chats.png'),
    updates: require('@/assets/images/updates.png'),
    calls: require('@/assets/images/calls.png'),
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.chats}
              style={{ width: 34, height: 24, marginHorizontal: 10, tintColor: focused ? 'blue' : 'gray' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Updates',
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.updates}
              style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.calls}
              style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
