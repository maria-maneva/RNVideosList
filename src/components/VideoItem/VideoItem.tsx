import React, {
  useRef,
  useState,
  useEffect,
  MutableRefObject,
  useCallback,
} from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';
import VideoControls from './VideoControls';
import Loader from '../Loader';
import { useIsAndroid } from './../../hooks';

interface IVideoItemProps {
  isPaused?: boolean;
  isFullScreen?: boolean;
  videoUrl: string;
  thumbnail?: string;
  onPlayPause: () => void;
  onFullScreen: () => void;
}

const VideoItem = ({
  onPlayPause,
  isPaused,
  isFullScreen,
  videoUrl,
  onFullScreen,
  thumbnail,
}: IVideoItemProps) => {
  const videoRef: MutableRefObject<Video | null> = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<OnLoadData | null>(null);
  const [progress, setProgress] = useState<OnProgressData | null>(null);
  const isAndroid = useIsAndroid();

  const handleSlidingComplete = useCallback(
    (value: number) => {
      videoRef.current?.seek(Math.floor(value), 20);
    },
    [videoRef],
  );

  const resetPlayer = useCallback(() => {
    videoRef.current?.seek(0);
    setProgress(prevProgress =>
      prevProgress
        ? { ...(prevProgress as OnProgressData), currentTime: 0 }
        : prevProgress,
    );
    if (!isPaused) {
      onPlayPause();
    }
  }, [videoRef, isPaused, onPlayPause]);

  const handleError = useCallback(error => {
    // note: videos over http will throw an unknown error on ios
    console.log(error);
    Alert.alert('Oops! Something went wrong with the video');
  }, []);

  const handleLoad = useCallback((loadData: OnLoadData) => {
    setLoaded(true);
    if (loadData) {
      setData(loadData);
    }
  }, []);

  const handleProgress = useCallback((progressData: OnProgressData) => {
    setProgress(progressData);
  }, []);

  useEffect(() => {
    if (isAndroid) {
      if (isFullScreen && videoRef.current) {
        videoRef.current?.presentFullscreenPlayer();
      } else {
        videoRef.current?.dismissFullscreenPlayer();
      }
    }
  }, [isFullScreen, videoRef, isAndroid]);

  return (
    <View style={[styles.container]}>
      {videoUrl ? (
        <>
          {!loaded && (
            <View style={styles.loaderContainer}>
              <Loader color="white" />
            </View>
          )}
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            paused={isPaused}
            onError={handleError}
            style={[styles.video]}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={resetPlayer}
            resizeMode="cover"
            poster={thumbnail ?? undefined}
            posterResizeMode="cover"
          />

          <VideoControls
            currentPlayTime={progress?.currentTime}
            duration={data?.duration ?? 0}
            isPaused={isPaused}
            onPlayPause={onPlayPause}
            onSlidingComplete={handleSlidingComplete}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          />
        </>
      ) : (
        <Text>Oops...</Text>
      )}
    </View>
  );
};

export default VideoItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
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
