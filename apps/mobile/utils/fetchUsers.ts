import { Contact } from '@/data/atom/contactAtom';
import { supabase } from '@/utils/supabase';

export const fetchUsers = async (senderId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('reciever_id, reciever_name')
      .eq('sender_id', senderId)

    if (error) {
      console.error('Error fetching users:', error.message);
      return [];
    }
    const uniqueContacts = new Map<string, Contact>();

    data.forEach((message: { reciever_id: string; reciever_name: string }) => {
        if (!uniqueContacts.has(message.reciever_id)) {
          uniqueContacts.set(message.reciever_id, {
            name: message.reciever_name,
            phone: message.reciever_id,
          });
        }
      });
      return Array.from(uniqueContacts.values());
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};