import { TVideosAction, VideoActions } from './videos.actions';
import { IVideoConfig } from '../configs';

export interface IVideosState {
  videos: IVideoConfig[] | null;
}

export const initialVideosState: IVideosState = {
  videos: null,
};

export const videosReducer = (
  state: IVideosState,
  action: TVideosAction,
): IVideosState => {
  let videoPayload: IVideoConfig;

  switch (action.type) {
    case VideoActions.SET_VIDEOS:
      return { ...state, videos: action.payload as IVideoConfig[] };

    case VideoActions.PLAY_PAUSE_VIDEO:
      if (state.videos) {
        videoPayload = action.payload as IVideoConfig;
        const newVideos1 = state.videos.map(vc => {
          if (vc.id === videoPayload.id) {
            return {
              ...videoPayload,
              isPaused: !vc.isPaused,
            };
          }
          return { ...vc, isPaused: true };
        });
        return { ...state, videos: newVideos1 };
      }
      return state;

    case VideoActions.TOGGLE_VIDEO_FULLSCREEN:
      if (state.videos) {
        videoPayload = action.payload as IVideoConfig;
        const newVideos2 = state.videos.map(vc => {
          if (vc.id === videoPayload.id) {
            return {
              ...videoPayload,
              isFullScreen: !videoPayload.isFullScreen,
            };
          }
          return { ...vc, isFullScreen: false };
        });
        return {
          ...state,
          videos: newVideos2,
        };
      }
      return state;

    default:
      return state;
  }
};
