export interface Message {
  id: string;
  sender_id: string;
  reciever_id: string;
  message: string;
  status: 'sent' | 'delivered' | 'seen';
  created_at: string;
}