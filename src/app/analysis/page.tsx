import { getAnalysisStats } from '@/actions/analysis.actions';
import AnalysisView from '@/components/analysis/AnalysisView';

export const metadata = {
  title: 'Diagnostics | Inner Margins',
  description: 'System diagnostics and memory analysis.',
};

export const revalidate = 3600;

export default async function AnalysisPage() {
  const stats = await getAnalysisStats();

  return <AnalysisView stats={stats} />;
}
