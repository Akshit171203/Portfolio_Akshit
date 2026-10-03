import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-dvh flex-col justify-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted">404</p>
      <h1 className="font-display mt-4 text-6xl font-bold sm:text-8xl">Nothing here.</h1>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-fg px-7 font-semibold text-bg"
      >
        Back to the portfolio
      </Link>
    </section>
  );
}
