'use client';

import { createContext, useContext, FunctionComponent, PropsWithChildren, useReducer, Dispatch } from 'react';

export type VideoState = {
  currentTime: number;
  playing: boolean;
  muted: boolean;
  volume: number;
  seeking: boolean;
};

// TODO - look at performance implications of including currentTime in this state as it will cause
// all subscribers to re-render on every time update
type VideoStateAction =
  | { type: 'SET_CURRENT_TIME'; currentTime: number }
  | { type: 'SET_PLAYING'; playing: boolean }
  | { type: 'SET_MUTED'; muted: boolean }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_SEEKING'; seeking: boolean };

const VideoStateContext = createContext<VideoState | undefined>(undefined);
const VideoStateDispatchContext = createContext<Dispatch<VideoStateAction> | undefined>(undefined);

const videoContextReducer = (state: VideoState, action: VideoStateAction) => {
  switch (action.type) {
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.currentTime };
    case 'SET_PLAYING':
      return { ...state, playing: action.playing };
    case 'SET_MUTED':
      return { ...state, muted: action.muted };
    case 'SET_VOLUME':
      return { ...state, volume: action.volume };
    case 'SET_SEEKING':
      return { ...state, seeking: action.seeking };
    default:
      throw new Error(`Unhandled action type: ${(action as VideoStateAction).type}`);
  }
};

const VideoStateContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(videoContextReducer, {
    currentTime: 0,
    playing: false,
    muted: true,
    volume: 1,
    seeking: false,
  });
  return (
    <VideoStateContext.Provider value={state}>
      <VideoStateDispatchContext.Provider value={dispatch}>{children}</VideoStateDispatchContext.Provider>
    </VideoStateContext.Provider>
  );
};

export const useVideoStateContext = () => {
  const context = useContext(VideoStateContext);
  if (context === undefined) {
    throw new Error('useVideoStateContext must be used within a VideoStateContextProvider');
  }
  return context;
};

export const useVideoStateDispatch = () => {
  const context = useContext(VideoStateDispatchContext);
  if (context === undefined) {
    throw new Error('useVideoStateDispatch must be used within a VideoStateContextProvider');
  }
  return context;
};

export default VideoStateContextProvider;
