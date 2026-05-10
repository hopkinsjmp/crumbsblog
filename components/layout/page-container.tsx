import React from 'react';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function PageContainer({ children, className, ...rest }: PageContainerProps) {
  return (
    <div
      className={`w-full px-4 py-6 sm:px-8 md:w-auto md:ml-[calc(50%-461px)] md:mr-auto md:max-w-[851px] md:px-8${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}
