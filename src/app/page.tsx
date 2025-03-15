import { Metadata } from 'next';
import SceneWrapper from '@/components/client/SceneWrapper';

export const metadata: Metadata = {
  title: 'Convective Heat Engine Visualization',
  description: 'Interactive 3D visualization of a convective heat engine',
};

export default function Home() {
  return (
    <main className="flex h-screen flex-col">
      <SceneWrapper />
    </main>
  );
}
