import { Link } from 'react-router';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Ярли
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Главное меню</h1>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/orders"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Страница
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">Открытые заказы на производство</p>
          </Link>

          <Link
            to="/closed-orders"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Страница
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">Закрытые заказы на производство</p>
          </Link>

          <Link
            to="/components"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Страница
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Компоненты
            </p>
          </Link>
          <Link
            to="/buckets"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Страница
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Расходные ёмкости
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
