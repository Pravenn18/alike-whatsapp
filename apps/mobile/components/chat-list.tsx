import { router } from 'expo-router';
import { View, Text, Image, Pressable } from 'react-native';

type ChatsListProps = {
    name: string;
    message: string;
    phone: string;
}

const icons = {
    user: require('@/assets/images/user.png'),
};
const ChatsList = ({name, message, phone}: ChatsListProps) => {
    const handlePress = () => {
        router.push({
            pathname: "/send-message",
            params: { contactPhone: phone }, // Pass contactPhone as a parameter
          });
    }
  return (
    <Pressable className='bg-gray-500 w-full' onPress={handlePress}>
        <View className='flex-row w-full'>
            <View className='self-center px-6'>
                <Image source={icons.user} className='w-10 h-10'/>
            </View>
            <View>
                <Text className='text-lg font-semibold text-white'>{name}</Text>
                <Text className='text-sm font-light text-gray-200'>{message}</Text>
            </View>
        </View>
    </Pressable>
  );
}

export default ChatsList;