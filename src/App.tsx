import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VideosList from './components/VideosList/VideosList';
import { videoConfigsInitial } from './configs';
import { setVideos } from './store/videos.actions';
import { useVideosDispatch } from './hooks';
import { createThumnails } from './utils';
import { useFullScreenVideo } from './hooks/useFullScreenVideo';
import VideoPlayerModal from './components/VideoPlayerModal';

const App = () => {
  const dispatch = useVideosDispatch();
  const fullScreenVideo = useFullScreenVideo();

  useEffect(() => {
    const initVideos = async () => {
      const thumbnails = await createThumnails(videoConfigsInitial);
      dispatch(
        setVideos(
          videoConfigsInitial.map((vc, index) => ({
            ...vc,
            thumb: thumbnails[index],
          })),
        ),
      );
    };

    initVideos();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text>VIDEOS</Text>
      </View>
      <VideosList />
      {fullScreenVideo && <VideoPlayerModal videoId={fullScreenVideo.id} />}
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
