'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
  PropsWithChildren,
  useReducer,
  Dispatch,
  useMemo,
} from 'react';

type State = { activeTrackCueIndex: number };
type Action = { type: 'SET_ACTIVE_TRACK_CUE_INDEX'; index: number };

const TrackCuesStateContext = createContext<State | undefined>(undefined);
const TrackCuesDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

const trackCuesContextReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TRACK_CUE_INDEX':
      return { ...state, activeTrackCueIndex: action.index };
    default:
      throw new Error(`Unhandled action type: ${(action as Action).type}`);
  }
};

const TrackCuesContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(trackCuesContextReducer, { activeTrackCueIndex: -1 });
  return (
    <TrackCuesStateContext.Provider value={state}>
      <TrackCuesDispatchContext.Provider value={dispatch}>{children}</TrackCuesDispatchContext.Provider>
    </TrackCuesStateContext.Provider>
  );
};

export const useTrackCues = () => {
  const context = useContext(TrackCuesStateContext);
  if (context === undefined) {
    throw new Error('useTrackCues must be used within a TrackCuesContextProvider');
  }
  return context;
};

export const useTrackCuesDispatch = () => {
  const context = useContext(TrackCuesDispatchContext);
  if (context === undefined) {
    throw new Error('useTrackCuesDispatch must be used within a TrackCuesContextProvider');
  }
  return context;
};

export default TrackCuesContextProvider;