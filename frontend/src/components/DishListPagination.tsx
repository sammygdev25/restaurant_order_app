import { Button } from '../components/ui';
import { Icon } from '../components/icons';

interface DishListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DishListPagination({ currentPage, totalPages, onPageChange }: DishListPaginationProps) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="ds-pagination" aria-label="Dish list pagination">
      <Button
        variant="ghost"
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size={16} />
        Previous
      </Button>
      <span className="ds-muted">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="ghost"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next
        <Icon name="chevron-right" size={16} />
      </Button>
    </nav>
  );
}