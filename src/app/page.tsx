import { getPublishedPosts, getFeaturedPosts } from '@/actions/post.actions';
import { getAnalysisStats } from '@/actions/analysis.actions';
import HomeHero from '@/components/home/HomeHero';
import HomeDiagnostics from '@/components/home/HomeDiagnostics';
import HomeFeatured from '@/components/home/HomeFeatured';
import HomeRecent from '@/components/home/HomeRecent';
import HomeCTA from '@/components/home/HomeCTA';

export const revalidate = 3600;

export default async function Home() {
  const posts = await getPublishedPosts(3);
  const featuredPosts = await getFeaturedPosts(2);
  const stats = await getAnalysisStats();

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface">
      <HomeHero />
      <HomeDiagnostics stats={stats} />
      {featuredPosts.length > 0 && <HomeFeatured posts={featuredPosts} />}
      <HomeRecent posts={posts} />
      <HomeCTA />
    </div>
  );
}
