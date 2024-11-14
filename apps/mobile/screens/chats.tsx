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
  const [phone] = useAtom(phoneAtom);
        useEffect(() => {
      const setupPushNotifications = async () => {
        const expoPushToken = await registerForPushNotificationsAsync();
        console.log('Phone:', JSON.stringify(typeof(phone)));
        console.log('Expo Push Token:', JSON.stringify(typeof(expoPushToken)));
        if (expoPushToken) {
          console.log("entered push fcm");
          try {
            console.log("entered push fcm2");
            const response = await axios.post(`${process.env.BASE_URL}/api/notifications/register`, {
              expoPushToken,
              phone,
            });
            console.log('Server response:', JSON.stringify(response.data));
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error('Axios error:', error.message);
              if (error.response) {
                console.error('Error response data:', JSON.stringify(error.response.data));
              } else {
                console.error('No response received:', error.request);
              }
            } else {
              console.error('Unexpected error:', error);
            }
          }
        }
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
