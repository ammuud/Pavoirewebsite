import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Pavoire Jewellery',
  description: 'Luxury feminine jewellery store with secure OTP checkout.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
