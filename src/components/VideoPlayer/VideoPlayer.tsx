import React, { forwardRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import VideoControls from './VideoControls';
import Loader from '../Loader';
import Video, { VideoProperties } from 'react-native-video';

type TVideoPlayerProps = {
  currentTime?: number;
  error?: boolean;
  duration?: number;
  isPaused?: boolean;
  isFullScreen?: boolean;
  loaded?: boolean;
  onSlidingComplete: (value: number) => void;
  onPlayPause?: () => void;
  onFullScreen?: () => void;
} & VideoProperties;

const VideoPlayer = forwardRef<Video, TVideoPlayerProps>(
  (
    {
      onPlayPause,
      error,
      currentTime,
      duration,
      isPaused,
      isFullScreen,
      onFullScreen,
      onSlidingComplete,
      loaded,
      ...rest
    },
    ref,
  ) => {
    return (
      <View style={[styles.container]}>
        <>
          {error && (
            <View style={styles.coverContainer}>
              <Text style={styles.coverText}>
                There was an error with this video
              </Text>
            </View>
          )}
          {!loaded && (
            <View style={styles.coverContainer}>
              <Loader color="white" />
            </View>
          )}
          <Video
            ref={ref}
            style={[styles.video]}
            resizeMode="cover"
            posterResizeMode="cover"
            paused={isPaused}
            {...rest}
          />
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
  },
);

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: {
    color: 'white',
  },
  video: {
    flex: 1,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
