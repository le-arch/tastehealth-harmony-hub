
import React from 'react';

interface ProgressGuardProps {
  children: React.ReactNode;
  requiredStage: string;
  currentPageName: string;
}

const ProgressGuard: React.FC<ProgressGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProgressGuard;
