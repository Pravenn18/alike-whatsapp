import { View, Text } from 'react-native';

const ChatsTopBar = () => {
  return (
    <View className='flex w-full'>
        <View className='flex-row justify-between '>
            <Text className='text-3xl p-4 font-medium text-white'>Whatsapp</Text>
        </View>
    </View>
  );
}

export default ChatsTopBar;