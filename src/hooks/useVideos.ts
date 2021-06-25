import { useMemo, useContext } from 'react';
import { IVideoConfig } from '../configs';
import { VideosContext } from '../store/videos.context';

export const useVideos = (): IVideoConfig[] | null => {
  const { state } = useContext(VideosContext);

  return useMemo(() => state.videos, [state]);
};
