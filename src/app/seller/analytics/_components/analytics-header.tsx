interface AnalyticsHeaderProps {
  pageLabel: string;
}

export function AnalyticsHeader({ pageLabel }: AnalyticsHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-6">
        <span className="whitespace-nowrap text-base font-bold tracking-tight text-gray-900 sm:text-lg">
          FashionHero <span className="font-normal text-gray-400">· Panel sprzedawcy</span>
        </span>
        <span className="text-gray-300">/</span>
        <span className="truncate text-sm text-gray-500">{pageLabel}</span>
      </div>
    </header>
  );
}
