import React from 'react';
import { Icon } from '../components/icons';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="ds-alert ds-alert-danger" role="alert">
      <Icon name="alert" size={18} />
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;