import { TVideosAction, VideoActions } from './videos.actions';
import { IVideoConfig } from '../configs';
import { playPauseStateVideo, toggleStateVideoFullScreen } from '../utils';

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
  const { payload } = action;
  switch (action.type) {
    case VideoActions.SET_VIDEOS:
      return { ...state, videos: payload as IVideoConfig[] };

    case VideoActions.PLAY_PAUSE_VIDEO:
      if (state.videos) {
        return {
          ...state,
          videos: playPauseStateVideo(state.videos, payload as IVideoConfig),
        };
      }
      return state;

    case VideoActions.TOGGLE_VIDEO_FULLSCREEN:
      if (state.videos) {
        return {
          ...state,
          videos: toggleStateVideoFullScreen(
            state.videos,
            payload as IVideoConfig,
          ),
        };
      }
      return state;

    default:
      return state;
  }
};
