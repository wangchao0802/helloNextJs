export const metadata = {
  title: "Next.js Hello World",
  description: "我的第一个Next.js应用",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning={true}>
      <head />
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
