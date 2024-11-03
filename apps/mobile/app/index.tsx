import { router } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function TabTwoScreen() {
  const handleNext = () => {
    router.push("/(home)");
  }
  return (
    <View style={{backgroundColor: "red", height: "100%"}}>
      <Button title='Next' onPress={handleNext}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
