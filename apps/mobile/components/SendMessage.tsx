import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator } from 'react-native';
import { useAtom } from 'jotai';
import { sendMessage, useMessages } from '../services/messageService';
import { messagesAtom } from '@/data/atom/messageAtom';
import { phoneAtom } from '@/data/atom/userAtom';
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
if (!messages) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
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
