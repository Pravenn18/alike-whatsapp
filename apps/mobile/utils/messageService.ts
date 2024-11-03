// utils/messageService.ts
import { supabase } from './supabase';

export const sendMessage = async (senderId: string, receiverId: string, messageContent: string) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([
            {
                sender_id: senderId,
                reciever_id: receiverId,
                status: 'sent',
                message: messageContent,
            }
        ]);

    if (error) {
        console.error('Error sending message:', error);
        return null;
    }

    return data;
};
