import Link from 'next/link';
import { HoverInfo } from './hover-info';

interface HeadingProps {
  title: string;
  description: string;
  href?: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, href }) => {
  return (
    <div id='heading' className='w-full'>
      <div className='flex justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
        <HoverInfo />
      </div>
      <p className='text-sm text-muted-foreground mt-2'>{description}</p>
      {href && (
        <Link
          href={href}
          className='text-sm underline text-muted-foreground hover:cursor-pointer hover:text-indigo-400'>
          Source Code
        </Link>
      )}
    </div>
  );
};
