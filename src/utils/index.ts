import { IVideoConfig } from '../configs';
import { createThumbnail } from 'react-native-create-thumbnail';

export const formatPlayTime = (timeInSeconds?: number) => {
  if (timeInSeconds) {
    const minutes = Math.floor(Math.ceil(timeInSeconds) / 60);
    const seconds = Math.ceil(timeInSeconds) % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  }
  return '00:00';
};

export const createThumnails = async (videos: IVideoConfig[]) =>
  await Promise.all(
    videos.map(async vc => {
      try {
        const { path } = await createThumbnail({
          url: vc.url as string,
          timeStamp: 4000,
          format: 'jpeg',
          cacheName: `vidThumb${vc.id}`,
        });
        return path;
      } catch (_) {
        return '';
      }
    }),
  );
