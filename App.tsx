import React from 'react';
import { View, Text } from 'react-native';
import VideosList from './src/components/VideosList';

const App = () => {
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View
        style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Text>VIDEOS</Text>
      </View>
      <VideosList />
    </View>
  );
};
export default App;
