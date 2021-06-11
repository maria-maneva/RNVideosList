import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback,
} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import VideoItem from './VideoItem/VideoItem';
import { videoConfigsInitial, IVideoConfig, CARD_HEIGHT } from '../configs';
import { useWindowDimensions } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { createThumbnail } from 'react-native-create-thumbnail';
import Loader from './Loader';

const VideosList = () => {
  const [videos, setVideos] = useState<IVideoConfig[] | null>(null);
  const listEl: MutableRefObject<FlatList | null> = useRef(null);
  const fullScreenVideo: IVideoConfig | null = useMemo(
    () => (videos ? videos?.find(vc => vc.isFullScreen) ?? null : null),
    [videos],
  );
  const { height } = useWindowDimensions();

  const handlePlayPause = useCallback(
    (id: string) => {
      if (videos) {
        setVideos(prevVideos =>
          prevVideos!.map(vc => ({
            ...vc,
            isPaused: id === vc.id ? !vc.isPaused : true,
          })),
        );
      }
    },
    [videos],
  );

  const handleFullScreen = useCallback(
    (id: string) => {
      if (videos) {
        setVideos(prevVideos =>
          prevVideos!.map(vc => ({
            ...vc,
            isFullScreen: id === vc.id ? !vc.isFullScreen : false,
          })),
        );
      }
    },
    [videos],
  );

  const createThumbnails = useCallback(async () => {
    // Generate thumbnails or get from cache
    const thumbnails: string[] = [];
    const thumbPromises = videoConfigsInitial.map(
      vc =>
        new Promise<void>(async (resolve, _) => {
          try {
            const response = await createThumbnail({
              url: vc.url as string,
              timeStamp: 4000,
              format: 'jpeg',
              cacheName: `vidThumb${vc.id}`,
            });
            thumbnails.push(response.path);
          } catch (err) {
            console.log(err, 'Error creating thumbnail');
            thumbnails.push('');
          } finally {
            resolve();
          }
        }),
    );

    return new Promise(async (resolve, _) => {
      await Promise.all(thumbPromises);
      resolve(thumbnails);
    });
  }, []);

  useEffect(() => {
    //Get thumbnails & set initial video data
    let thumbnails: string[];

    const loadThumbnails = async () => {
      thumbnails = (await createThumbnails()) as string[];
      setVideos(() =>
        videoConfigsInitial.map((vc, index) => ({
          ...vc,
          thumb: thumbnails[index] ?? null,
        })),
      );
    };

    loadThumbnails();
  }, []);

  useEffect(() => {
    // Toggle full screen
    if (fullScreenVideo) {
      const elIndex = videos?.findIndex(el => el.id === fullScreenVideo?.id);
      Orientation.lockToLandscape();
      listEl.current?.scrollToIndex({ index: elIndex ?? 0, animated: false });
    } else {
      Orientation.unlockAllOrientations();
    }
  }, [fullScreenVideo]);

  return (
    <View style={fullScreenVideo ? styles.containerFull : styles.containerGrid}>
      <FlatList
        ref={listEl}
        data={videos}
        keyExtractor={({ id }) => id}
        scrollEnabled={!fullScreenVideo}
        ListEmptyComponent={<Loader message="Loading thumbnails..." />}
        renderItem={({ item }) => (
          <View
            style={{
              height: item.isFullScreen ? height : CARD_HEIGHT,
            }}>
            <VideoItem
              onPlayPause={() => handlePlayPause(item.id)}
              isPaused={item.isPaused}
              videoUrl={item.url}
              thumbnail={item.thumb}
              isFullScreen={item.isFullScreen}
              onFullScreen={() => handleFullScreen(item.id)}
            />
          </View>
        )}
        initialNumToRender={4}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
        removeClippedSubviews={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerGrid: {
    flex: 1,
    flexDirection: 'column',
  },
  containerFull: {
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default VideosList;
