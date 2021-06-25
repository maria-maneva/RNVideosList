import { useVideos } from '.';
import { useMemo } from 'react';

export const useFullScreenVideo = () => {
  const videos = useVideos();
  const fullScreenVideo = useMemo(
    () => videos?.find(vc => vc.isFullScreen),
    [videos],
  );

  return useMemo(() => fullScreenVideo, [fullScreenVideo]);
};
