export const generatePagination = (currentPage: number, totalPages: number) => {
  // If total number of pages is less than or equal to 7, show pages without ellipsis
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // if current page is between the first three pages, show the first three pages, ellipsis, and the last pages
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // if current page is between the last three pages, show the first two pages, ellipsis, and the last three pages
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  //If current page is in any other middle position, show the first page, ellipsis, current page, ellipsis, and the last page
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
