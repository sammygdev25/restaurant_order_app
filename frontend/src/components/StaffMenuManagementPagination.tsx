import { Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffMenuManagementPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function StaffMenuManagementPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: StaffMenuManagementPaginationProps) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="ds-pagination">
      <Button
        variant="ghost"
        onClick={onPrevious}
        disabled={currentPage <= 1}
      >
        <Icon name="chevron-left" size={16} />
        Previous
      </Button>
      <span className="ds-muted">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="ghost"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        Next
        <Icon name="chevron-right" size={16} />
      </Button>
    </div>
  );
}