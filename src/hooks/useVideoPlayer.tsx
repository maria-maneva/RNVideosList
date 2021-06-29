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

const useVideoPlayer = (videoId: string, isInModal?: boolean) => {
  const dispatch = useVideosDispatch();
  const videoRef: MutableRefObject<Video | null> = useRef(null);

  const video = useVideo(videoId);
  const { isPaused, url, thumb, isFullScreen, progress } = video;
  const _isPaused = useMemo(
    () => (!isInModal && isFullScreen ? true : isPaused),
    [isFullScreen, isInModal, isPaused],
  );

  const [duration, setDuration] = useState(0);
  const [_progress, _setProgress] = useState(0);
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
        progress: _progress,
      }),
    );
  }, [dispatch, _progress, video]);

  const reset = useCallback(() => {
    videoRef.current?.seek(0);
    if (!isPaused) {
      togglePlayPause();
    }
  }, [isPaused, togglePlayPause]);

  const _resumePosition = useCallback(() => {
    videoRef.current?.seek(progress ?? 0, 0);
  }, [progress]);

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
    _setProgress(currentTime);
  }, []);

  const _handleProgress = useCallback(({ currentTime }: OnProgressData) => {
    setError(false);
    _setProgress(currentTime);
  }, []);

  const _handleSlidingComplete = useCallback(
    (value: number) => {
      videoRef.current?.seek(Math.ceil(value));
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
      currentTime={_progress ?? progress}
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
    progress: _progress,
    togglePlayPause,
    reset,
  };
};

export default useVideoPlayer;
