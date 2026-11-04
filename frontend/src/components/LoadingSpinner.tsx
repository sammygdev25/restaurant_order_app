import React from 'react';

interface LoadingSpinnerProps {
  size?: string;
}

const SIZE_MAP: Record<string, string> = {
  sm: '1.25rem',
  small: '1.25rem',
  md: '2.25rem',
  medium: '2.25rem',
  lg: '3.5rem',
  large: '3.5rem',
};

function resolveSize(size?: string): string {
  if (!size) return SIZE_MAP.md;
  return SIZE_MAP[size.toLowerCase()] || size;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const dimension = resolveSize(size);

  return (
    <div
      className="ds-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span
        className="ds-spinner"
        style={{ width: dimension, height: dimension }}
      />
    </div>
  );
};

export default LoadingSpinner;