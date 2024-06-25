'use client';

import { createContext, useContext, FunctionComponent, PropsWithChildren, useReducer, Dispatch, act } from 'react';

export type VideoState = {
  isReady: boolean;
  currentTime: number;
  playing: boolean;
  muted: boolean;
  volume: number;
  seeking: boolean;
  activeTrackCueIndex: number;
  pauseOnCueExit: boolean;
};

// TODO - look at performance implications of including currentTime in this state as it will cause
// all subscribers to re-render on every time update
type VideoStateAction =
  | { type: 'SET_IS_READY'; isReady: boolean }
  | { type: 'SET_CURRENT_TIME'; currentTime: number }
  | { type: 'SET_PLAYING'; playing: boolean }
  | { type: 'SET_MUTED'; muted: boolean }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_SEEKING'; seeking: boolean }
  | { type: 'SET_ACTIVE_TRACK_CUE_INDEX'; activeTrackCueIndex: number }
  | { type: 'TOGGLE_PAUSE_ON_CUE_EXIT' };

const VideoStateContext = createContext<VideoState | undefined>(undefined);
const VideoStateDispatchContext = createContext<Dispatch<VideoStateAction> | undefined>(undefined);

const videoContextReducer = (state: VideoState, action: VideoStateAction) => {
  switch (action.type) {
    case 'SET_IS_READY':
      return { ...state, isReady: action.isReady };
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
    case 'SET_ACTIVE_TRACK_CUE_INDEX':
      return { ...state, activeTrackCueIndex: action.activeTrackCueIndex };
    case 'TOGGLE_PAUSE_ON_CUE_EXIT':
      return { ...state, pauseOnCueExit: !state.pauseOnCueExit };
    default:
      throw new Error(`Unhandled action type: ${(action as VideoStateAction).type}`);
  }
};

const VideoStateContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(videoContextReducer, {
    isReady: false,
    currentTime: 0,
    playing: false,
    muted: true,
    volume: 1,
    seeking: false,
    activeTrackCueIndex: -1,
    pauseOnCueExit: true,
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
