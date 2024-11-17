import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { useAtom } from 'jotai';
import { sendMessage, useMessages, updateMessageStatus } from '../services/messageService';
import { latestMessageAtom, messagesAtom } from '@/data/atom/messageAtom';
import { nameAtom, phoneAtom } from '@/data/atom/userAtom';
import { useRoute } from '@react-navigation/native';
import { Message } from '@/types/Message';
import { SafeAreaView } from 'react-native-safe-area-context';

const backgroundImage = require('@/assets/images/whatsappbg.png'); // Replace with your image path

const MessageStatus = ({ status, time }: { status: Message['status'], time: Message['created_at'] }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'seen':
        return '✓✓';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    return status === 'seen' ? '#34B7F1' : '#8696A0';
  };

  return (
    <View className='flex-row'>
    <Text style={{ color: '#8696A0', marginLeft: 5 }} className='text-xs pt-2'>
      {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
    <Text style={{ color: getStatusColor(), marginLeft: 5 }} className='text-xs pt-2'>
      {getStatusIcon()}
    </Text>
    </View>
  );
};


const ChatScreen = () => {
  const [phone] = useAtom(phoneAtom);
  const userPhone = phone;
  const route = useRoute();
  const { contactPhone } = route.params as { contactPhone: string };

  const [message, setMessage] = useState('');
  const [messages] = useAtom(messagesAtom);
  const [latestMessage] = useAtom(latestMessageAtom);
  console.log('latestMessages:', JSON.stringify(latestMessage));

  useMessages(userPhone, contactPhone);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(userPhone, contactPhone, message);
      setMessage('');
    }
  };

  
  useEffect(() => {
    const markMessagesAsSeen = async () => {
      const unseenMessages = messages.filter(
        msg => 
          msg.reciever_id === userPhone && 
        msg.status === 'delivered'
      );
      console.log('unseenMessages:', JSON.stringify(unseenMessages));
      for (const msg of unseenMessages) {
        await updateMessageStatus(msg.id, 'seen');
      }
    };
    
    markMessagesAsSeen();
  }, [messages, userPhone]);
  
  //TODO: Implement notification
  // useEffect(() => {
  //   const sendMessageNotification = async () => {
  //     const latestMsg = messages[messages.length - 1];
  //     console.log('latestMsg:', JSON.stringify(latestMsg));
  //     if (latestMsg && latestMsg.reciever_id === contactPhone && latestMsg.status !== 'seen') {
  //       await sendNotification(
  //         contactPhone,
  //         `Message Received from ${userName}`, 
  //         latestMsg.message || 'Received a message'
  //       );
  //     }
  //   };
  //   sendMessageNotification();
  // }, [messages]);

  if (!messages) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <View className='flex-1 p-5'>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className={`p-[1px] ${item.sender_id === userPhone ? 'items-end' : 'items-start'}`}>
              <View className={`flex-row p-1 px-2 rounded-lg ${
                item.sender_id === userPhone ? 'bg-green-200' : 'bg-gray-200'
              }`}>
                <Text className="text-base">{item.message}</Text>
                {item.sender_id === userPhone && (
                  <MessageStatus status={item.status} time={item.created_at}/>
                )}
              </View>
            </View>
          )}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2"
          />
          <TouchableOpacity 
            onPress={handleSendMessage}
            className="bg-blue-500 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    </SafeAreaView>
  );
};

export default ChatScreen;