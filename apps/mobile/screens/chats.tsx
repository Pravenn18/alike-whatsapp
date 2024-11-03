import ChatsList from '@/components/chat-list';
import ChatsTopBar from '@/components/chats-top-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const USERCHATS = [
  {
    name: "Praveen",
    message: "Kya kar rah hai?"
  },
  {
    name: "Pratham",
    message: "Hello"
  },
  {
    name: "Raj",
    message: "Hello"
  },
  {
    name: "Roashan",
    message: "Hello"
  },
  ]

export default function TabTwoScreen() {
  return (
    <SafeAreaView className='flex items-center bg-gray-900 h-full'>
      <ChatsTopBar />
      {USERCHATS.map((items) => 
      <View className='w-full pt-1'>
        <ChatsList name={items.name} message={items.message} />
      </View>
    )}
    </SafeAreaView>
  );
}
