import React, { useMemo } from 'react';
import Slider from '@react-native-community/slider';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { formatPlayTime } from '../../utils';

interface IVideoControls {
  currentPlayTime?: number;
  duration?: number;
  isPaused?: boolean;
  onPlayPause?: () => void;
  onSlidingComplete?: (value: number) => void;
  onFullScreen?: () => void;
  isFullScreen?: boolean;
}

const VideoControls = ({
  currentPlayTime,
  duration,
  isPaused,
  onPlayPause,
  onSlidingComplete,
  onFullScreen,
  isFullScreen,
}: IVideoControls) => {
  const formattedPlayTime = useMemo(
    () => formatPlayTime(currentPlayTime),
    [currentPlayTime],
  );
  return (
    <View style={styles.controls}>
      <TouchableOpacity
        onPress={onPlayPause}
        style={[styles.controlsItem, styles.button]}>
        <Text style={styles.buttonText}>{isPaused ? 'Play' : 'Pause'}</Text>
      </TouchableOpacity>
      <Slider
        style={[styles.controlsItem, styles.slider]}
        minimumValue={0}
        maximumValue={duration}
        value={currentPlayTime ?? 0}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor="white"
        maximumTrackTintColor="grey"
        thumbTintColor="white"
        step={1}
      />
      <View style={[styles.controlsItem]}>
        <Text style={styles.buttonText}>{formattedPlayTime}</Text>
      </View>
      <TouchableOpacity
        onPress={onFullScreen}
        style={[styles.controlsItem, styles.button]}>
        <Text style={styles.buttonText}>{isFullScreen ? 'Min' : 'Full'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoControls;

const styles = StyleSheet.create({
  controls: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    height: 45,
    zIndex: 1,
    elevation: 1,
  },
  controlsItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,0, 0, .7)',
  },
  buttonText: {
    color: 'white',
  },
  slider: {
    flex: 4,
  },
});
