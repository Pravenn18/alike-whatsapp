import { sendMessage } from '@/utils/messageService';
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const ChatComponent = ({ senderId, receiverId } : any) => {
    const [messageContent, setMessageContent] = useState('');

    const handleSendMessage = async () => {
        const response = await sendMessage(senderId, receiverId, messageContent);
        console.log(JSON.stringify(response));
        if (response) {
            console.log('Message sent:', response);
            setMessageContent('');
        }else{
            console.log("Error")
        }
    };

    return (
        <View className='flex items-center justify-center h-full'>
            <TextInput
                value={messageContent}
                onChangeText={setMessageContent}
                placeholder="Type a message"
                className='border-black border mb-2'
            />
            <Button title="Send" onPress={handleSendMessage} />
        </View>
    );
};

export default ChatComponent;
