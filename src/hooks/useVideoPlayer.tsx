import React, {
  useState,
  MutableRefObject,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import Video, {
  OnLoadData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { useVideo } from '.';
import {
  setPlayPause,
  setToggleVideoFullScreen,
} from '../store/videos.actions';
import { useVideosDispatch } from './useVideosDispatch';
import { Platform } from 'react-native';

const useVideoPlayer = (videoId: string, isInModal?: boolean) => {
  const dispatch = useVideosDispatch();
  const videoRef: MutableRefObject<Video | null> = useRef(null);

  const video = useVideo(videoId);
  const { isPaused, url, thumb, isFullScreen, resumeFrom } = video;
  const _isPaused = useMemo(
    () => (!isInModal && isFullScreen ? true : isPaused),
    [isFullScreen, isInModal, isPaused],
  );

  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const togglePlayPause = useCallback(() => {
    dispatch(setPlayPause({ ...video }));
  }, [dispatch, video]);

  // When player's full screen functionality is toggled,
  // the currrent progress is stored in the reducer
  // so that after the switch the playback could resume from the same place
  const toggleFullScreen = useCallback(() => {
    dispatch(
      setToggleVideoFullScreen({
        ...video,
        resumeFrom: progress,
      }),
    );
  }, [dispatch, progress, video]);

  const reset = useCallback(() => {
    videoRef.current?.seek(0);
    // 'reset' currently loops on iOS due to this bug
    // https://github.com/react-native-video/react-native-video/issues/958
    // can be fixed with adding extra logic if needed
    if (!isPaused && Platform.OS === 'android') {
      togglePlayPause();
    }
  }, [isPaused, togglePlayPause]);

  const _resumePosition = useCallback(() => {
    videoRef.current?.seek(resumeFrom ?? 0, 0);
  }, [resumeFrom]);

  const _handleLoad = useCallback(
    (loadData: OnLoadData) => {
      if (loadData) {
        setDuration(loadData.duration);
      }
      setLoaded(true);
      _resumePosition();
    },
    [_resumePosition],
  );

  const _handleError = useCallback(e => {
    // note: videos over http will throw an unknown error on ios
    console.log(e);
    setError(true);
  }, []);

  const _handleSeek = useCallback(({ currentTime }: OnSeekData) => {
    setProgress(Math.ceil(currentTime));
  }, []);

  const _handleProgress = useCallback(({ currentTime }: OnProgressData) => {
    setError(false);
    setProgress(Math.ceil(currentTime));
  }, []);

  const _handleSlidingComplete = useCallback(
    (value: number) => {
      videoRef.current?.seek(value, 0);
    },
    [videoRef],
  );

  useEffect(() => {
    if (isFullScreen && isInModal) {
      Orientation.lockToLandscape();
    } else {
      Orientation.unlockAllOrientations();
    }
  }, [isFullScreen, isInModal]);

  useEffect(() => {
    if (!isFullScreen) {
      _resumePosition();
    }
  }, [_resumePosition, isFullScreen]);

  const component = (
    <VideoPlayer
      source={{ uri: url! }}
      onPlayPause={togglePlayPause}
      duration={duration}
      currentTime={progress}
      isFullScreen={isFullScreen && isInModal}
      isPaused={_isPaused}
      loaded={!!url && loaded}
      onFullScreen={toggleFullScreen}
      onSlidingComplete={_handleSlidingComplete}
      error={error}
      // Video props
      ref={videoRef}
      onError={_handleError}
      onLoad={_handleLoad}
      onProgress={_handleProgress}
      onEnd={reset}
      poster={thumb ?? ''}
      posterResizeMode="cover"
      onSeek={_handleSeek}
    />
  );

  return {
    component,
    videoRef,
    isPaused: _isPaused,
    isFullScreen,
    progress,
    togglePlayPause,
    reset,
  };
};

export default useVideoPlayer;
