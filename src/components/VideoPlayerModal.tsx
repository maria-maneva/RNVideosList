import React from 'react';
import { Modal } from 'react-native';
import useVideoPlayer from '../hooks/useVideoPlayer';

const VideoPlayerModal = ({ videoId }: { videoId: string }) => {
  const player = useVideoPlayer(videoId, true);

  return (
    <Modal
      supportedOrientations={['landscape']}
      presentationStyle={'fullScreen'}
      statusBarTranslucent={true}>
      {player.component}
    </Modal>
  );
};

export default VideoPlayerModal;
