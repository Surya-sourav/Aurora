import { fetchPersonal } from '@/lib/api';
import { PortfolioEditor } from '@/components/admin/PortfolioEditor';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolio() {
  const personal = await fetchPersonal();
  return (
    <div>
      <h2 className="font-mono text-lg mb-6">
        <span className="text-[--color-faint]">## </span>portfolio
      </h2>
      <PortfolioEditor personal={personal} />
    </div>
  );
}
