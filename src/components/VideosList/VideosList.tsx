import React, { useRef, MutableRefObject, useMemo } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import Loader from '../Loader';
import { useVideos } from '../../hooks/useVideos';
import VideoListItem from './VideoListItem';

const VideosList = () => {
  const videos = useVideos();
  const listEl: MutableRefObject<FlatList | null> = useRef(null);
  const { width } = useWindowDimensions();
  const cardHeight = useMemo(() => width * (9 / 16), [width]);

  return (
    <View style={styles.videosList}>
      <FlatList
        ref={listEl}
        data={videos}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={<Loader message="Loading thumbnails..." />}
        renderItem={({ item }) => (
          <View
            style={{
              height: cardHeight,
            }}>
            <VideoListItem id={item.id} />
          </View>
        )}
        initialNumToRender={4}
        getItemLayout={(_, index) => ({
          length: cardHeight,
          offset: cardHeight * index,
          index,
        })}
        removeClippedSubviews={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videosList: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default VideosList;
