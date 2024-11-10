import { supabase } from "./supabase";

export const sendMessage = async (sender: string, receiver: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender_id: sender, reciever_id: receiver, message: content, status: "Sent" }]);

  if (error) {
    console.error('Error sending message:', error);
  }
  
  return data;
};
