import { Link, useParams } from 'react-router';

export default function OrderDetailsPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-700"
          >
            ← Back to orders
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order</p>
            <h1 className="text-2xl font-semibold text-gray-900">{orderId}</h1>
          </div>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
          Order details page placeholder.
        </div>
      </div>
    </div>
  );
}
