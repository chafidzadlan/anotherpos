interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  itemName?: string;
}

export function PaginationInfo({
  currentPage,
  itemsPerPage,
  totalItems,
  itemName = "items",
}: PaginationInfoProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="text-sm text-slate-600">
      Showing {startIndex + 1} to {endIndex} of {totalItems} {itemName}
    </div>
  );
}