import type { Metadata } from 'next';
import Nav from './(components)/Nav';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout (
  {
    children
  }: Readonly<{
    children: React.ReactNode;
  }>
) {
  return (
    <html lang="en">
    <body className="bg-gray-100">
    <Nav />
    <div className="m-2">
      {children}
      <Toaster />
    </div>
    </body>
    </html>
  );
}
