interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-6 flex items-center justify-center gap-3">
      <button
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>

      <span className="font-medium text-slate-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </nav>
  );
}

export default Pagination;
