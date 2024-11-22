import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { useAtom } from 'jotai';
import { sendMessage, useMessages, updateMessageStatus } from '../services/messageService';
import { latestMessageAtom, messagesAtom } from '@/data/atom/messageAtom';
import { nameAtom, phoneAtom } from '@/data/atom/userAtom';
import { useRoute } from '@react-navigation/native';
import { Message } from '@/types/Message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';

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
  const { chatId, contactPhone } = route.params as { chatId: string, contactPhone: string };

  const [message, setMessage] = useState('');
  const [messages] = useAtom(messagesAtom);
  const [latestMessage] = useAtom(latestMessageAtom);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  console.log('chatID:', JSON.stringify(chatId));

  console.log('latestMessages:', JSON.stringify(latestMessage));

  useMessages(chatId);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(phone, chatId, message, 'text');
      setMessage('');
    }
  };

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      const unseenMessages = messages.filter(
        msg => 
          msg.status === 'delivered'
      );
      console.log('unseenMessages:', JSON.stringify(unseenMessages));
      for (const msg of unseenMessages) {
        await updateMessageStatus(msg.id, 'seen');
      }
    };

    markMessagesAsSeen();
  }, [messages, userPhone]);

  // useEffect(() => {
  //   const fetchUserStatus = async () => {
  //     const { data, error } = await supabase
  //       .from('users')
  //       .select('online, last_seen')
  //       .eq('phone', contactPhone)
  //       .single();

  //     if (error) {
  //       console.error('Error fetching user status:', error);
  //     } else {
  //       setIsOnline(data.online);
  //       setLastSeen(data.last_seen);
  //     }
  //   };

  //   fetchUserStatus();

  //   const unsubscribe = subscribeToUserStatus(contactPhone, (online, lastSeen) => {
  //     setIsOnline(online);
  //     setLastSeen(lastSeen);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [contactPhone]);

  // useEffect(() => {
  //   const updateLastSeen = async () => {
  //     await updateUserLastSeen(userPhone);
  //   };

  //   const updateOnlineStatus = async () => {
  //     await updateUserOnlineStatus(userPhone, true);
  //     window.addEventListener('beforeunload', async () => {
  //       await updateUserOnlineStatus(userPhone, false);
  //     });
  //   };

  //   updateLastSeen();
  //   updateOnlineStatus();

  //   return () => {
  //     updateUserOnlineStatus(userPhone, false);
  //   };
  // }, [userPhone]);

  // Filter out null messages
  const filteredMessages = messages.filter(msg => msg !== null);

  // if (!filteredMessages.length) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <SafeAreaView className='flex-1 p-5'>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-lg font-bold text-white'>{contactPhone}</Text>
          {isOnline ? (
            <Text className='text-sm text-green-500'>Online</Text>
          ) : (
            lastSeen && (
              <Text className='text-sm text-gray-300'>
                Last seen: {new Date(lastSeen).toLocaleString()}
              </Text>
            )
          )}
        </View>
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className={`p-3 ${item.sender_id === userPhone ? 'items-end' : 'items-start'}`}>
              <View className={`flex-row p-2 rounded-lg ${
                item.sender_id === userPhone ? 'bg-green-200' : 'bg-gray-200'
              }`}>
                <Text className="text-sm">{item.content}</Text>
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
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ChatScreen;