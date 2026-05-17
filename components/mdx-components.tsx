import { format } from 'date-fns';
import React from 'react';
import Image from 'next/image';
import { Video } from './blocks/video';
import { Mermaid } from './blocks/mermaid';
import { withBasePath } from '@/lib/utils';

export const components: Record<string, React.ComponentType<any>> = {
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="overflow-x-auto rounded-lg bg-[#2c1d14] p-4 font-mono text-sm text-[#f7f4ef] my-4"
      {...props}
    />
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = className?.startsWith('language-');
    if (isBlock) return <code className={className} {...props}>{children}</code>;
    return (
      <code
        className="rounded bg-[#2c1d14]/10 px-1.5 py-0.5 font-mono text-sm text-[#a93e33]"
        {...props}
      >
        {children}
      </code>
    );
  },
  BlockQuote: (props: { children: React.ReactNode; authorName: string }) => (
    <div>
      <blockquote>
        {props.children}
        {props.authorName}
      </blockquote>
    </div>
  ),
  DateTime: (props: { format?: string }) => {
    const dt = new Date();
    switch (props.format) {
      case 'iso':
        return <span>{format(dt, 'yyyy-MM-dd')}</span>;
      case 'utc':
        return <span>{format(dt, 'eee, dd MMM yyyy HH:mm:ss OOOO')}</span>;
      case 'local':
        return <span>{format(dt, 'P')}</span>;
      default:
        return <span>{format(dt, 'P')}</span>;
    }
  },
  NewsletterSignup: (props: {
    children: React.ReactNode;
    placeholder: string;
    buttonText: string;
    disclaimer?: React.ReactNode;
  }) => (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div>{props.children}</div>
        <div className="mt-8">
          <form className="sm:flex">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email-address"
              type="email"
              autoComplete="email"
              required
              className="w-full px-5 py-3 border border-gray-300 shadow-xs placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:max-w-xs rounded-md"
              placeholder={props.placeholder}
            />
            <div className="mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {props.buttonText}
              </button>
            </div>
          </form>
          {props.disclaimer && (
            <div className="mt-3 text-sm text-gray-500">{props.disclaimer}</div>
          )}
        </div>
      </div>
    </div>
  ),
  img: (props: { src?: string; alt?: string }) => {
    if (!props?.src) return null;
    return (
      <span className="flex items-center justify-center">
        <Image
          src={withBasePath(props.src)}
          alt={props.alt || ''}
          width={500}
          height={500}
          unoptimized
        />
      </span>
    );
  },
  mermaid: (props: any) => <Mermaid {...props} />,
  video: (props: any) => <Video data={props} />,
};
