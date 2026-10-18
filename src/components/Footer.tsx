import Image from "next/image";
import Link from "next/link";
import { agency, chapters } from "@/lib/content";

const links = chapters.filter((chapter) => chapter.id !== "top");

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <Image
          src="/brand/mark.png"
          alt="B2B."
          width={602}
          height={306}
          className="mark"
        />
        <div>
          <p className="footer-mail">
            <a href={`mailto:${agency.email}`}>{agency.email}</a>
          </p>
          <p className="footer-meta">{agency.location}</p>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p className="footer-meta">© {new Date().getFullYear()} {agency.legal}</p>
        <nav aria-label="Footer">
          {links.map((link) => (
            <Link key={link.id} href={`/#${link.id}`}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
