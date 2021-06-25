import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import VideoControls from './VideoControls';
import Loader from '../Loader';

interface IVideoPlayerProps {
  currentTime?: number;
  error?: boolean;
  duration?: number;
  thumbnail?: string;
  isPaused?: boolean;
  isFullScreen?: boolean;
  loaded?: boolean;
  onSlidingComplete: (value: number) => void;
  onPlayPause?: () => void;
  onFullScreen?: () => void;
}

const VideoPlayer: React.FC<IVideoPlayerProps> = ({
  onPlayPause,
  error,
  currentTime,
  duration,
  isPaused,
  isFullScreen,
  onFullScreen,
  onSlidingComplete,
  loaded,
  children,
}) => {
  useEffect(() => {
    console.log({ duration, isPaused });
  }, [duration, isPaused]);
  return (
    <View style={[styles.container]}>
      <>
        {error && (
          <View style={styles.coverContainer}>
            <Text>There was an error with this video</Text>
          </View>
        )}
        {!loaded && (
          <View style={styles.coverContainer}>
            <Loader color="white" />
          </View>
        )}
        {children}
        <VideoControls
          currentPlayTime={currentTime ?? 0}
          duration={duration ?? 100}
          isPaused={isPaused}
          onPlayPause={onPlayPause}
          onSlidingComplete={onSlidingComplete}
          onFullScreen={onFullScreen}
          isFullScreen={isFullScreen}
        />
      </>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    zIndex: 2,
    elevation: 2,
  },
});
