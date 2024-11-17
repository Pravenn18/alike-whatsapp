import { supabase } from "../utils/supabase";
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { latestMessageAtom, messagesAtom } from '@/data/atom/messageAtom';
import { Message } from '@/types/Message';

export const sendMessage = async (sender: string, receiver: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ 
      sender_id: sender, 
      reciever_id: receiver, 
      message: content, 
      status: "sent" 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
  }
  
  return data;
};

export const updateMessageStatus = async (messageId: string, status: 'delivered' | 'seen') => {
  const { data, error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', messageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating message status:', error);
  }

  return data;
};

export const useMessages = (userPhone: string, contactPhone: string) => {
  const setMessages = useSetAtom(messagesAtom);
  const setLatestMessage = useSetAtom(latestMessageAtom);

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
        const nonNullMessages = (data as Message[]).filter(msg => msg.message);
        setMessages(nonNullMessages);
        
        // Mark received messages as delivered
        const undeliveredMessages = (data as Message[])
          .filter(msg => 
            msg.reciever_id === userPhone && 
            msg.status === 'sent'
          );

        for (const msg of undeliveredMessages) {
          await updateMessageStatus(msg.id, 'delivered');
        }
      }
    };

    fetchMessages();

    // Listen for new messages and status updates
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' }, 
        (payload) => {
          const newMessage = payload.new as Message;
          
          if (payload.eventType === 'INSERT') {
            setMessages((messages) => [...messages, newMessage]);
            setLatestMessage(newMessage);
            console.log('New message:', JSON.stringify(newMessage));
            // If we're the receiver, mark as delivered
            if (newMessage.reciever_id === contactPhone) {
              console.log('Marking as delivered');
              updateMessageStatus(newMessage.id, 'delivered');
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages((messages) => 
              messages.map(msg => 
                msg.id === newMessage.id ? newMessage : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userPhone, contactPhone, setMessages]);
};