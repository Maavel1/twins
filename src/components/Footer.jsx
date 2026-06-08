import { footerLinks } from "../data/siteData.js";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <img
            src="/twins__logo.svg"
            alt="Twins"
            className="h-9 w-auto max-w-[116px] object-contain"
          />
          <span className="text-sm text-gray-400">· Костанай</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          {footerLinks.map((link) => (
            <a key={link} href="#top" className="transition hover:text-gray-800">
              {link}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400">© 2026 Twins. Все права защищены.</p>
      </div>
    </footer>
  );
}
