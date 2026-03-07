import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { OrderStatus } from '@repo/api';
import { useAllOrders } from '../features/orders/hooks/orders.hook';
import { usePlatform } from '~/shared/hooks/usePlatform';

function formatWeight(weight?: string) {
  if (!weight) return 'Не указан';
  const parsed = Number(weight);
  if (Number.isNaN(parsed)) return `${weight} кг`;
  return `${parsed.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} кг`;
}

function formatPlannedAt(plannedAt?: string | null) {
  if (!plannedAt) return 'Не указано';
  const parsed = new Date(plannedAt);
  if (Number.isNaN(parsed.getTime())) return plannedAt;
  return parsed.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useAllOrders([OrderStatus.OPEN, OrderStatus.IN_PROGRESS]);
  const { getUrl } = usePlatform();

  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!normalizedSearch) return orders;

    return orders.filter((order) => {
      const orderNumber = order.orderNumber?.toLowerCase() ?? '';
      const label = order.label?.toLowerCase() ?? '';
      return (
        orderNumber.includes(normalizedSearch) ||
        label.includes(normalizedSearch)
      );
    });
  }, [orders, normalizedSearch]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_45%,#f1f5f9_100%)] p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur">
          <Link
            to={getUrl({
              appUrl: 'scanner:///',
              webUrl: '/',
            })}
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-700"
          >
            <span className="flex items-center justify-center w-8 h-8 mr-2 bg-indigo-100 group-hover:bg-indigo-200 rounded-full transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
            <span className="font-medium">В главное меню</span>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Заказы на производство
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Поиск по партии и названию заказа
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <label htmlFor="order-search" className="sr-only">
              Поиск заказа
            </label>
            <input
              id="order-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Введите партию или название заказа"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-slate-100">
              Найдено: {filteredOrders.length}
            </div>
          </div>
        </header>

        {isLoading && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Загрузка заказов...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось получить список заказов
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && (orders?.length ?? 0) === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Заказы не найдены.
          </div>
        )}

        {!isLoading &&
          !isError &&
          (orders?.length ?? 0) > 0 &&
          filteredOrders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
              По вашему запросу ничего не найдено.
            </div>
          )}

        <div className="grid gap-3">
          {filteredOrders.map((order) => (
            <Link
              to={getUrl({
                appUrl: `scanner:///orders/${order.id}`,
                webUrl: `/orders/${order.id}`,
              })}
              key={order.id}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Партия {order.orderNumber}
                  </p>
                  <p className="mt-1  text-xl font-semibold text-slate-900 transition group-hover:text-blue-700">
                    {order.label}
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {order.status === OrderStatus.IN_PROGRESS
                    ? 'В работе'
                    : 'Открыт'}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Вес заказа
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatWeight(order.weight)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Дата исполнения
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatPlannedAt(order.plannedAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
