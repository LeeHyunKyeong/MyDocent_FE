import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';

import PlayerPage from './pages/player-page';
import MainPage from './pages/main-page';

const Stack = createNativeStackNavigator();

export default function App() {
  useFonts({
    WantedSansRegular: require('./assets/font/WantedSans-Regular.ttf'),
    WantedSansSemiBold: require('./assets/font/WantedSans-SemiBold.ttf'),
    WantedSansBold: require('./assets/font/WantedSans-Bold.ttf'),
  });

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Player" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainPage} />
          <Stack.Screen name="Player" component={PlayerPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D0F',
  },
});