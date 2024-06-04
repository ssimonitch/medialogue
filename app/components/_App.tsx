'use client';

import { useEffect, useRef, useState, FunctionComponent } from 'react';
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from '../contexts/DeepgramContextProvider';
import { MicrophoneEvents, MicrophoneState, useMicrophone } from '../contexts/MicrophoneContextProvider';
import Visualizer from './Visualizer';

const App: FunctionComponent = () => {
  const [caption, setCaption] = useState<string | undefined>('Say something');
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();

  useEffect(() => {
    console.log('[App] setupMicrophone');
    setupMicrophone();
  }, [setupMicrophone]);

  // useEffect(() => {
  //   if (microphoneState === MicrophoneState.Ready) {
  //     connectToDeepgram({
  //       model: 'nova-2',
  //       language: 'en',
  //       interim_results: true,
  //       smart_format: true,
  //       filler_words: true,
  //       utterance_end_ms: 3000,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [microphoneState]);

  // useEffect(() => {
  //   if (!microphone) return;
  //   if (!connection) return;

  //   const onData = (e: BlobEvent) => {
  //     connection?.send(e.data);
  //   };

  //   const onTranscript = (data: LiveTranscriptionEvent) => {
  //     const { is_final: isFinal, speech_final: speechFinal } = data;
  //     let thisCaption = data.channel.alternatives[0].transcript;

  //     console.log('thisCaption', thisCaption);
  //     if (thisCaption !== '') {
  //       console.log('thisCaption !== ""', thisCaption);
  //       setCaption(thisCaption);
  //     }

  //     if (isFinal && speechFinal) {
  //       clearTimeout(captionTimeout.current);
  //       captionTimeout.current = setTimeout(() => {
  //         setCaption(undefined);
  //         clearTimeout(captionTimeout.current);
  //       }, 3000);
  //     }
  //   };

  //   if (connectionState === LiveConnectionState.OPEN) {
  //     connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
  //     microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

  //     startMicrophone();
  //   }

  //   return () => {
  //     // prettier-ignore
  //     connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
  //     microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
  //     clearTimeout(captionTimeout.current);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [connectionState]);

  // useEffect(() => {
  //   if (!connection) return;

  //   if (microphoneState !== MicrophoneState.Open && connectionState === LiveConnectionState.OPEN) {
  //     connection.keepAlive();

  //     keepAliveInterval.current = setInterval(() => {
  //       connection.keepAlive();
  //     }, 10000);
  //   } else {
  //     clearInterval(keepAliveInterval.current);
  //   }

  //   return () => {
  //     clearInterval(keepAliveInterval.current);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [microphoneState, connectionState]);

  return (
    // <div className='flex h-full antialiased'>
    //   <div className='flex flex-row h-full w-full overflow-x-hidden'>
    //     <div className='flex flex-col flex-auto h-full'>
    //       {/* height 100% minus 8rem */}
    //       <div className='relative w-full h-full'>
    //         {microphone && <Visualizer microphone={microphone} />}
    //         <div className='absolute bottom-[8rem]  inset-x-0 max-w-4xl mx-auto text-center'>
    //           {caption && <span className='p-8'>{caption}</span>}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      <video controls muted preload='metadata'>
        <source src='/demo/video-1.mp4' type='video/mp4' />
        <track label='English' kind='captions' srcLang='en' default src='/demo/video-1.vtt' />
      </video>
    </div>
  );
};

export default App;
