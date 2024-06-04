import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { DeepgramContextProvider } from './contexts/DeepgramContextProvider';
import { MicrophoneContextProvider } from './contexts/MicrophoneContextProvider';
import VideoStateContextProvider from './contexts/VideoStateContextProvider';
import TrackCuesContextProvider from './contexts/TrackCuesContextProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medialogue',
  description: 'Dialogue with your media',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MicrophoneContextProvider>
          <DeepgramContextProvider>
            <VideoStateContextProvider>
              <TrackCuesContextProvider>{children}</TrackCuesContextProvider>
            </VideoStateContextProvider>
          </DeepgramContextProvider>
        </MicrophoneContextProvider>
      </body>
    </html>
  );
}
