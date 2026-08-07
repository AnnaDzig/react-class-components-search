import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import ErrorButton from "@/components/ErrorButton";
import Header from "@/components/Header";
import SelectedItemsFlyout from "@/components/SelectedItemsFlyout";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeProvider from "@/context/ThemeProvider";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations("navigation");
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <main
          lang={locale as Locale}
          className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
          <div className="mx-auto max-w-5xl">
            <Header />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <nav className="mb-6 flex justify-center">
              <Link
                className="rounded-lg bg-white px-5 py-2 font-medium text-slate-700 shadow transition hover:text-slate-900 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white"
                href="/about">
                {t("about")}
              </Link>
            </nav>

            {children}

            <SelectedItemsFlyout />

            <div className="mt-6 flex justify-end">
              <ErrorButton />
            </div>
          </div>
        </main>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
