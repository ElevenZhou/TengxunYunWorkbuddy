import Hero from '@/components/Hero';
import ToolGrid from '@/components/ToolGrid';
import CategoryNav from '@/components/CategoryNav';

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoryNav />
      <ToolGrid />
    </div>
  );
}
