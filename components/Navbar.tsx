import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-border fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="CryptoLoan Logo" width={32} height={32} />
            <span className="text-2xl font-bold">CryptoLoan</span>
          </Link>
          <div className="space-x-4">
            <Link href="/dashboard" className="hover:text-accent-foreground">Dashboard</Link>
            <Link href="/kyc" className="hover:text-accent-foreground">KYC</Link>
            <Link href="/terms" className="hover:text-accent-foreground">Terms</Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}