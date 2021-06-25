import React from 'react';
import useVideoPlayer from '../../hooks/useVideoPlayer';

interface IVideoItemProps {
  id: string;
}

const VideoListItem = ({ id }: IVideoItemProps) => {
  const Player = useVideoPlayer(id);
  return <>{Player.component}</>;
};

export default VideoListItem;
