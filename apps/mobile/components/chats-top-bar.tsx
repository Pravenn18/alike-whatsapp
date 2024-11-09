import { nameAtom } from '@/atom/userAtom';
import { useAtom } from 'jotai';
import { View, Text } from 'react-native';

const ChatsTopBar = () => {
  const [name] = useAtom(nameAtom);
return (
    <View className='flex w-full'>
        <View className='flex-row justify-between '>
            <Text className='text-3xl p-4 font-medium text-white'>Whatsapp</Text>
            <Text className='text-lg p-4 font-normal text-white'>Hello, {name}</Text>
        </View>
    </View>
  );
}

export default ChatsTopBar;