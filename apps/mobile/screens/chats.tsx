import { phoneAtom } from '@/atom/userAtom';
import ChatsList from '@/components/chat-list';
import ChatsTopBar from '@/components/chats-top-bar';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const USERCHATS = [
  {
    name: "Praveen",
    message: "Dev",
    phone: "7424938034"
  },
  {
    name: "Shubham",
    message: "Kya kar rah hai?",
    phone: "8861076748"
  },
  {
    name: "Pratham",
    message: "Hello",
    phone: "7259857219"
  },
  {
    name: "Raj",
    message: "Hello",
    phone: "7870034353"
  },
  {
    name: "Roashan",
    message: "Hello",
    phone: "7425879610"
  },
  ]

  export default function TabTwoScreen() {
  const phone = useAtom(phoneAtom);
  useEffect(() => {
    const setupPushNotifications = async () => {
      const expoPushToken = await registerForPushNotificationsAsync();
      console.log('Expo Push Token:', JSON.stringify(expoPushToken));
      if (expoPushToken) {

        // Send the token to your backend for later use
        await axios.post('http://localhost:3000/api/notifications/register', {
          expoPushToken,
          phone
        });
      }
    };

    setupPushNotifications();
  }, []);
  useEffect(() => {
    const setupPushNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      console.log('Expo Push Token: chat', token);
      // Send the token to your backend for later use
    };

    setupPushNotifications();
  }, []);
  return (
    <SafeAreaView className='flex items-center bg-gray-900 h-full'>
      <ChatsTopBar />
      {USERCHATS.map((items) => 
      <View className='w-full pt-1'>
        <ChatsList name={items.name} message={items.message} phone={items.phone} />
      </View>
    )}
    </SafeAreaView>
  );
}
