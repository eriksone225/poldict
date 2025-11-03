
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CreateVotableDialog } from '@/components/votables/CreateVotableDialog';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';


export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Logo className="h-14 w-auto text-primary-foreground" />
          </Link>
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-base font-semibold transition-colors',
                  pathname === link.href
                    ? 'text-primary-foreground'
                    : 'text-primary-foreground/80 hover:text-primary-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
           <div className="hidden md:flex">
             <CreateVotableDialog />
           </div>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="border-b pb-4">
                  <Link href="/dashboard" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
                     <Logo className="h-12 w-auto text-primary" />
                  </Link>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                   {navLinks.map((link) => (
                     <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-semibold",
                         pathname === link.href ? "text-primary" : "text-foreground/80"
                      )}
                      onClick={() => setIsSheetOpen(false)}
                     >
                       {link.label}
                     </Link>
                   ))}
                   <div className="pt-4 border-t">
                    <CreateVotableDialog />
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
