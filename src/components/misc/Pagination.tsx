// components/Pagination.tsx
"use client";

import { useState, useMemo } from "react";
import { LuCircleChevronLeft, LuCircleChevronRight } from "react-icons/lu";

interface PaginationProps {
  totalEntries: number;
  rowsPerPage: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination = ({ totalEntries, rowsPerPage, initialPage = 1, onPageChange }: PaginationProps) => {
  const totalPages = useMemo(() => Math.ceil(totalEntries / rowsPerPage), [totalEntries, rowsPerPage]);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
      {/* Entry Count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{startEntry}</span>–<span className="font-medium">{endEntry}</span> of{" "}
        <span className="font-medium">{totalEntries}</span> entries
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center space-x-2">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-20"
          disabled={currentPage === 1}
        >
          <LuCircleChevronLeft size={25} className="" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
              page === currentPage ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-20"
          disabled={currentPage === totalPages}
        >
          <LuCircleChevronRight size={25} className="" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
