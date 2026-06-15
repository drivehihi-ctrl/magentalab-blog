"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-20">
      {/* Navigation Info */}
      <div className="text-sm font-medium text-gray-400">
        Page <span className="text-magenta font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
      </div>

      <nav className="flex items-center gap-2" aria-label="Pagination">
        {/* Previous Button */}
        <Link
          href={createPageURL(currentPage - 1)}
          className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all shadow-sm ${
            currentPage <= 1
              ? "border-gray-50 text-gray-200 pointer-events-none"
              : "border-gray-100 text-gray-600 hover:border-magenta hover:text-magenta hover:shadow-md active:scale-95"
          }`}
          aria-disabled={currentPage <= 1}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Page Numbers */}
        <div className="flex items-center gap-2 px-2">
          {startPage > 1 && (
            <>
              <Link
                href={createPageURL(1)}
                className="flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-transparent text-gray-500 font-bold hover:text-magenta transition-colors"
              >
                1
              </Link>
              {startPage > 2 && <span className="text-gray-300 font-bold px-1">···</span>}
            </>
          )}

          {pages.map((page) => (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 font-bold transition-all ${
                currentPage === page
                  ? "bg-magenta border-magenta text-white shadow-lg shadow-magenta/30 scale-110 z-10"
                  : "border-gray-50 text-gray-500 hover:border-magenta/30 hover:text-magenta"
              }`}
            >
              {page}
            </Link>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-300 font-bold px-1">···</span>}
              <Link
                href={createPageURL(totalPages)}
                className="flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-transparent text-gray-500 font-bold hover:text-magenta transition-colors"
              >
                {totalPages}
              </Link>
            </>
          )}
        </div>

        {/* Next Button */}
        <Link
          href={createPageURL(currentPage + 1)}
          className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all shadow-sm ${
            currentPage >= totalPages
              ? "border-gray-50 text-gray-200 pointer-events-none"
              : "border-gray-100 text-gray-600 hover:border-magenta hover:text-magenta hover:shadow-md active:scale-95"
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </nav>
    </div>
  );
}
