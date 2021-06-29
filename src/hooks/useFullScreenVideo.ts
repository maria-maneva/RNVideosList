import { useVideos } from '.';
import { useMemo } from 'react';

export const useFullScreenVideo = () => {
  const videos = useVideos();
  return useMemo(() => videos?.find(vc => vc.isFullScreen), [videos]);
};
