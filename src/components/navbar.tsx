"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Aperture,
  LogOut,
  Menu,
  PlusCircle,
  User as UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#host-guarantee" },
];

export function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [currentHash, setCurrentHash] = React.useState("");

  const { user, logout } = useAuth();

  // 1. Update hash instantly when Next.js Link changes the URL (no reload needed)
  React.useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);

    updateHash();

    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function (...args) {
      const result = originalPush.apply(this, args);
      setTimeout(updateHash, 0);
      return result;
    };

    window.history.replaceState = function (...args) {
      const result = originalReplace.apply(this, args);
      setTimeout(updateHash, 0);
      return result;
    };

    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, [pathname]);

  // 2. On the home page, highlight the link of the section currently in view
  React.useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = ["how-it-works", "host-guarantee"];

    const onScroll = () => {
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = `#${id}`;
        }
      }

      setCurrentHash((prev) => (prev === current ? prev : current));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Only the current route/section is active
  const isNavActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && currentHash === "";
    }

    if (href === "/studios") {
      return pathname.startsWith("/studios");
    }

    if (href === "/#how-it-works") {
      return pathname === "/" && currentHash === "#how-it-works";
    }

    if (href === "/#host-guarantee") {
      return pathname === "/" && currentHash === "#host-guarantee";
    }

    return pathname === href;
  };

  const closeMenus = () => {
    setIsOpen(false);
    setUserMenuOpen(false);
  };

  // Update hash state immediately on click
  const handleNavClick = (href: string) => {
    const hashIndex = href.indexOf("#");
    setCurrentHash(hashIndex >= 0 ? href.slice(hashIndex) : "");
    closeMenus();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand / Logo */}
        <Link
          href="/"
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Aperture className="size-6 text-[#db1a6e]" />

          <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            StudioSpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = isNavActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "font-semibold text-[#db1a6e]"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex size-10 items-center justify-center rounded-full bg-[#db1a6e] font-bold text-white shadow-xs transition-transform hover:scale-105 active:scale-95"
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      {user.name}
                    </p>

                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <UserIcon className="size-4 text-[#db1a6e]" />
                      Profile
                    </Link>

                    <Link
                      href="/add-studio"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <PlusCircle className="size-4 text-[#db1a6e]" />
                      Add New Studio
                    </Link>

                    <Link
                      href="/my-listings"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <UserIcon className="size-4 text-slate-400" />
                      My Listings
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-slate-200 px-5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button className="h-9 rounded-xl bg-[#db1a6e] px-5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#c2135f] active:scale-98">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 text-lg font-bold">
                  <Aperture className="size-5 text-[#db1a6e]" />
                  StudioSpace
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-5">

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-3">
                  {NAV_ITEMS.map((item) => {
                    const isActive = isNavActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                          isActive
                            ? "bg-pink-50 font-semibold text-[#db1a6e] dark:bg-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Auth Section */}
                <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-200 pt-5 dark:border-slate-800">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-1 py-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#db1a6e] font-bold text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>

                        <div>
                          <div className="font-bold text-slate-950 dark:text-white">
                            {user.name}
                          </div>

                          <div className="text-xs text-slate-500">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="h-10 w-full rounded-xl border-slate-200 text-sm font-semibold dark:border-slate-800"
                        >
                          Profile
                        </Button>
                      </Link>

                      <Link href="/my-listings" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="h-10 w-full rounded-xl border-slate-200 text-sm font-semibold dark:border-slate-800"
                        >
                          My Listings
                        </Button>
                      </Link>

                      <Link href="/add-studio" onClick={() => setIsOpen(false)}>
                        <Button className="h-10 w-full rounded-xl bg-[#db1a6e] text-sm font-semibold text-white hover:bg-[#c2135f]">
                          Add New Studio
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="h-10 w-full rounded-xl text-rose-600"
                      >
                        <LogOut className="mr-2 size-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="h-10 w-full rounded-xl border-slate-200 text-sm font-semibold dark:border-slate-800"
                        >
                          Login
                        </Button>
                      </Link>

                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="h-10 w-full rounded-xl bg-[#db1a6e] text-sm font-semibold text-white hover:bg-[#c2135f]">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}