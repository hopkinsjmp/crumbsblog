import React from 'react';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function PageContainer({ children, className, ...rest }: PageContainerProps) {
  return (
    <div
      className={`ml-[calc(50%-461px)] mr-auto max-w-[851px] px-8 py-6${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}
