import videos from '../../videos.json';

export const CARD_HEIGHT: number = 280;

interface IInputData {
  description: string;
  sources: string[];
  subtitle: string;
  thumb: string;
  title: string;
}

export interface IVideoConfig {
  id: string;
  url: string | null;
  thumb?: string | null;
  isPaused: boolean;
  isFullScreen: boolean;
}

export const videoConfigsInitial: IVideoConfig[] = (() =>
  (videos as IInputData[]).map((videoData, index) => ({
    id: `${index}`,
    url: videoData.sources[0],
    isPaused: true,
    thumb: null,
    isFullScreen: false,
  })))();
