import { Dispatch, useContext, useMemo } from 'react';
import { TVideosAction } from '../store/videos.actions';
import { VideosContext } from '../store/videos.context';

export const useVideosDispatch = (): Dispatch<TVideosAction> => {
  const { dispatch } = useContext(VideosContext);

  return useMemo(() => dispatch, [dispatch]);
};
