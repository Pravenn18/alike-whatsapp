import { supabase } from "../utils/supabase";
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { messagesAtom } from '@/data/atom/messageAtom';
import { Message } from '@/types/Message';

export const sendMessage = async (sender: string, receiver: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender_id: sender, reciever_id: receiver, message: content, status: "Sent" }]);

  if (error) {
    console.error('Error sending message:', error);
  }
  
  return data;
};

export const useMessages = (userPhone: string, contactPhone: string) => {
  const setMessages = useSetAtom(messagesAtom);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(reciever_id.eq.${userPhone},sender_id.eq.${contactPhone}),and(reciever_id.eq.${contactPhone},sender_id.eq.${userPhone})`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        console.log("messageSet")
        setMessages(data as Message[]);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages((messages) => [...messages, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userPhone, setMessages]);
};
