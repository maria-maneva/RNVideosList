import React, { useRef, MutableRefObject } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { CARD_HEIGHT } from '../../configs';
import Loader from '../Loader';
import { useVideos } from '../../hooks/useVideos';
import VideoListItem from './VideoListItem';

const VideosList = () => {
  const videos = useVideos();
  const listEl: MutableRefObject<FlatList | null> = useRef(null);

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
              height: CARD_HEIGHT,
            }}>
            <VideoListItem id={item.id} />
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
  videosList: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default VideosList;
