import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-36 pb-20">
      <p className="text-xs tracking-widest text-red-500 uppercase">404</p>
      <h1 className="font-brand mt-3 text-5xl font-black text-white">This page is not here.</h1>
      <Link href="/" className="mt-8 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white">
        Back to B2B.
      </Link>
    </div>
  );
}
