import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function FooterHome() {
  return (
    <footer className="bg-white lg:ml-30 lg:mr-60 text-center  dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Branding */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">
              Knect
            </h2>
            <p className="text-sm text-muted-foreground">
              Empowering Ethiopian students to collaborate, learn, and grow
              together.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-white mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/resources" className="hover:text-primary">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-primary">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/collaborate" className="hover:text-primary">
                  Collaboration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-white mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-primary">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Social */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-white mb-3">
              Legal & Social
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="mailto:abdigashahun0@gmail.com"
                  className="hover:text-primary"
                >
                  Email Us
                </a>
              </li>
              <li className="flex gap-4 mt-2">
                <Link
                  href="https://github.com/your-username"
                  target="_blank"
                  className="hover:text-primary"
                >
                  <Github className="size-4" />
                </Link>
                <Link
                  href="https://linkedin.com/in/your-linkedin"
                  target="_blank"
                  className="hover:text-primary"
                >
                  <Linkedin className="size-4" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-zinc-100 dark:border-zinc-800 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Knect. Built by students, for students.
        </div>
      </div>
    </footer>
  );
}