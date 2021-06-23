import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VideosList from './src/components/VideosList';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text>VIDEOS</Text>
      </View>
      <VideosList />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  listContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
