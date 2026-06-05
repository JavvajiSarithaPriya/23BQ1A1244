import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-24 sm:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Campus Notifications Dashboard
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            A responsive React/Next app for viewing notifications, filtering by type, and highlighting priority notifications with new/seen tracking.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href="/all"
              className="rounded-2xl border border-slate-200 bg-slate-900 px-6 py-5 text-center text-lg font-semibold text-white transition hover:bg-slate-800"
            >
              View All Notifications
            </Link>
            <Link
              href="/priority"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              View Priority Notifications
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
