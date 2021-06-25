import React, { useReducer, createContext, Dispatch } from 'react';
import { TVideosAction } from './videos.actions';
import {
  initialVideosState,
  IVideosState,
  videosReducer,
} from './videos.reducer';

export interface IVideosContext {
  state: IVideosState;
  dispatch: Dispatch<TVideosAction>;
}

export const VideosContext = createContext<IVideosContext>({
  state: initialVideosState,
  dispatch: () => undefined,
});

export const VideosProvider: React.FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(videosReducer, initialVideosState);

  return (
    <VideosContext.Provider value={{ state, dispatch }}>
      {children}
    </VideosContext.Provider>
  );
};
