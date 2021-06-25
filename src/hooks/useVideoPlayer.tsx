import React, {
  useMemo,
  useState,
  MutableRefObject,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';
import { StyleSheet } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { Platform } from 'react-native';
import { useVideo } from '.';
import {
  setPlayPause,
  setToggleVideoFullScreen,
} from '../store/videos.actions';
import { useVideosDispatch } from './useVideosDispatch';

const useVideoPlayer = (videoId: string, isInModal?: boolean) => {
  const dispatch = useVideosDispatch();
  const video = useVideo(videoId);
  const { isPaused, url, thumb, isFullScreen, progress } = video;
  const [data, setData] = useState<OnLoadData | null>(null);
  const [localProgress, setLocalProgress] = useState<OnProgressData | null>(
    null,
  );
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const videoRef: MutableRefObject<Video | null> = useRef(null);
  const isAndroid = useMemo(() => Platform.OS === 'android', []);

  const _handleLoad = useCallback((loadData: OnLoadData) => {
    setLoaded(true);
    if (loadData) {
      setData(loadData);
    }
  }, []);

  const _handleError = useCallback(e => {
    // note: videos over http will throw an unknown error on ios
    console.log(e);
    setError(true);
  }, []);

  const _handleProgress = useCallback((progressData: OnProgressData) => {
    setLocalProgress(progressData);
  }, []);

  const _handleSlidingComplete = useCallback(
    (value: number) => {
      videoRef.current?.seek(Math.floor(value), 20);
    },
    [videoRef],
  );

  const toggle = useCallback(() => {
    dispatch(setPlayPause({ ...video, progress: localProgress?.currentTime }));
  }, [dispatch, localProgress?.currentTime, video]);

  const toggleFullScreen = useCallback(() => {
    dispatch(
      setToggleVideoFullScreen({
        ...video,
        progress: localProgress?.currentTime,
      }),
    );
  }, [dispatch, localProgress?.currentTime, video]);

  const reset = useCallback(() => {
    videoRef.current?.seek(0);
    setLocalProgress(prevProgress =>
      prevProgress
        ? { ...(prevProgress as OnProgressData), currentTime: 0 }
        : prevProgress,
    );
    if (!isPaused) {
      toggle();
    }
  }, [videoRef, isPaused, toggle]);

  useEffect(() => {
    if (progress && videoRef.current) {
      videoRef.current.seek(progress ?? 0);
    }
  }, [isPaused, isFullScreen, progress]);

  useEffect(() => {
    if (isFullScreen && isInModal) {
      Orientation.lockToLandscape();
    } else {
      Orientation.unlockAllOrientations();
    }
    if (isAndroid) {
      if (isFullScreen && isInModal) {
        videoRef.current?.presentFullscreenPlayer();
      } else {
        videoRef.current?.dismissFullscreenPlayer();
      }
    }
  }, [isFullScreen, isAndroid, isInModal]);

  const videoEl = useMemo(() => {
    return (
      url && (
        <Video
          ref={videoRef}
          source={{ uri: url }}
          paused={!isInModal && isFullScreen ? true : isPaused}
          onError={_handleError}
          style={[styles.video]}
          onLoad={_handleLoad}
          onProgress={_handleProgress}
          onEnd={reset}
          resizeMode="cover"
          poster={thumb ?? ''}
          posterResizeMode="cover"
        />
      )
    );
  }, [
    isPaused,
    _handleLoad,
    _handleError,
    videoRef,
    _handleProgress,
    thumb,
    url,
    isInModal,
    isFullScreen,
    reset,
  ]);

  const playerEl = useMemo(
    () => (
      <VideoPlayer
        onPlayPause={toggle}
        duration={data?.duration}
        currentTime={localProgress?.currentTime}
        isFullScreen={isFullScreen && isInModal}
        isPaused={!isInModal && isFullScreen ? true : isPaused}
        loaded={loaded}
        onFullScreen={toggleFullScreen}
        onSlidingComplete={_handleSlidingComplete}
        error={error}>
        {videoEl}
      </VideoPlayer>
    ),
    [
      loaded,
      isPaused,
      toggle,
      isFullScreen,
      toggleFullScreen,
      _handleSlidingComplete,
      isInModal,
      data?.duration,
      error,
      localProgress?.currentTime,
      videoEl,
    ],
  );

  return {
    component: playerEl,
    videoRef,
    isPaused,
    progress,
    toggle,
  };
};

export default useVideoPlayer;

const styles = StyleSheet.create({
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
