export const runtime = 'edge';

import SearchResults from '@/components/SearchResults';

export default function Home({ searchParams }: { searchParams: Record<string, string> }) {
  const searchTerm = searchParams.search || '';
  
  return (
    <div>
      <SearchResults searchTerm={searchTerm} />
    </div>
  );
}