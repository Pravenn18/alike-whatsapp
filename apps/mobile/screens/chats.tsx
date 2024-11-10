import ChatsList from '@/components/chat-list';
import ChatsTopBar from '@/components/chats-top-bar';
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
