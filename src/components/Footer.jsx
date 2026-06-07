import { footerLinks } from "../data/siteData.js";
import { LogoMark } from "./Icons.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <span className="font-semibold text-gray-950">Twins</span>
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
