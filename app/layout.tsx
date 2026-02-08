import React from 'react';

export const metadata = {
  title: 'Webhook Handler',
  description: 'Elfsight webhook handler for OnRamp API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

