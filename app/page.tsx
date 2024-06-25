import App from './components/App';
import VideoStateContextProvider from './contexts/VideoStateContextProvider';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideoStateContextProvider>
        <App />
      </VideoStateContextProvider>
    </main>
  );
}
