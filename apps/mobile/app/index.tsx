// import { router } from 'expo-router';
// import { Button, StyleSheet, View } from 'react-native';

// export default function TabTwoScreen() {
//   const handleNext = () => {
//     router.push("/(home)");
//   }
//   return (
//     <View style={{backgroundColor: "red", height: "100%"}}>
//       <Button title='Next' onPress={handleNext}></Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   headerImage: {
//     color: '#808080',
//     bottom: -90,
//     left: -35,
//     position: 'absolute',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
// });
import { otpAtom } from '@/atom/otpAtom';
import { nameAtom, phoneAtom } from '@/atom/userAtom';
import { initiatePhoneAuth } from '@/utils/auth';
import { router } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Button } from 'react-native';

const SignUpScreen: React.FC = () => {
  const [phone, setPhoneInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setNameInput] = useState<string>('');
  const [, setPhone] = useAtom(phoneAtom);
  const [, setName] = useAtom(nameAtom);
  const setOtp = useSetAtom(otpAtom);

  const handleSignUp = async () => {
    if (!phone) {
      Alert.alert("Please enter a phone number");
      return;
    }
    setLoading(true);

    try {
      const { error } = await initiatePhoneAuth(phone, name, setOtp);
      if (error) {
        Alert.alert("Error sending OTP", error.message);
      } else {
        Alert.alert("OTP sent!", "Please check your SMS messages for the verification code.");
        setPhone(phone);
        setName(name);    
        router.push({ pathname: './(auth)/enter-otp', params: { phone } })
      }
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    router.push("./(tabs)")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up with Phone</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhoneInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        placeholderTextColor="#aaa"
        keyboardType="default"
        value={name}
        onChangeText={setNameInput}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </Text>
      </TouchableOpacity>
      <Button title="route" onPress={handleNext}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SignUpScreen;
