import ChatComponent from '@/components/SendMessage';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  const [message, setMessage] = useState<string>('');

  return (
    <View style={styles.container}>
      <Text>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    backgroundColor: "red",
    padding: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    width: '80%', // Adjust width as needed
    backgroundColor: 'white',
  },
});
