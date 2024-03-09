export const metadata = {
  title: "Video conferencing app",
  description: "Video meeting app using webRTC and next js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
