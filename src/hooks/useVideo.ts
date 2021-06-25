import { useVideos } from '.';
import { useMemo } from 'react';
import { IVideoConfig } from '../configs';

export const useVideo = (id: string): IVideoConfig => {
  const videos = useVideos();
  const video = useMemo(() => videos?.find(vc => vc.id === id), [videos, id]);
  return useMemo(() => video!, [video]);
};
