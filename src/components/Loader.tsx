import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ message, color }: { message?: string; color?: string }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color ?? 'teal'} />
      {message && <Text>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
