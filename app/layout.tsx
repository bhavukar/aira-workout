import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Pixelify_Sans, Newsreader } from 'next/font/google';
import './globals.css';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const pixelFont = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixel',
  weight: ['500', '600', '700'],
});

const serifFont = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['italic'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'AiRA · The Multimodal Workout Companion',
  description: 'AI whose voice you can talk over, whose screen brings what you imagine to life, and whose face shows you how she feels.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sansFont.variable} ${pixelFont.variable} ${serifFont.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      </head>
      <body className="bg-[#090807] text-[#FAF6EE] min-h-screen antialiased selection:bg-[#F2541A] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
