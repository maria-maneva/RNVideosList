import { IVideoConfig } from '../configs';

export enum VideoActions {
  SET_VIDEOS = 'SET_VIDEOS',
  PLAY_PAUSE_VIDEO = 'PLAY_PAUSE_VIDEO',
  TOGGLE_VIDEO_FULLSCREEN = 'TOGGLE_VIDEO_FULLSCREEN',
}

export interface IVideosAction {
  type: VideoActions;
}

export interface IsetVideos extends IVideosAction {
  payload: IVideoConfig[];
}

export interface IsetPlayPause extends IVideosAction {
  payload: IVideoConfig;
}
export interface IsetToggleVideoFullScreen extends IVideosAction {
  payload: IVideoConfig;
}

export type TVideosAction =
  | IsetVideos
  | IsetPlayPause
  | IsetToggleVideoFullScreen;

export const setVideos = (videos: IVideoConfig[]): IsetVideos => ({
  type: VideoActions.SET_VIDEOS,
  payload: videos,
});

export const setPlayPause = (video: IVideoConfig): IsetPlayPause => ({
  type: VideoActions.PLAY_PAUSE_VIDEO,
  payload: video,
});

export const setToggleVideoFullScreen = (
  video: IVideoConfig,
): IsetToggleVideoFullScreen => ({
  type: VideoActions.TOGGLE_VIDEO_FULLSCREEN,
  payload: video,
});
