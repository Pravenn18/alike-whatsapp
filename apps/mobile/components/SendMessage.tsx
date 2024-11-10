import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { useAtom } from 'jotai';
import { sendMessage } from '../utils/messageService';
import { useMessages } from '@/hooks/useMessage';
import { messagesAtom } from '@/atom/messageAtom';
import { phoneAtom } from '@/atom/userAtom';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const [phone] = useAtom(phoneAtom);
  const userPhone = phone;
  const route = useRoute();
  const { contactPhone } = route.params as { contactPhone: string };

  const [message, setMessage] = useState('');
  const [messages] = useAtom(messagesAtom);

  useMessages(userPhone, contactPhone);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(userPhone, contactPhone, message);
      setMessage('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        // keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className='p-5 flex-end'>
            <Text className='bg-red-200 text-lg font-medium'>{item.message}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          style={{ flex: 1, borderWidth: 1, padding: 10 }}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;
