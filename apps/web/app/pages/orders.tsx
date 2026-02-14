import { Link } from 'react-router';
import { useAllOrders } from '../features/orders/hooks/orders.hook';
import { OrderStatus } from '@repo/api';
export default function OrdersPage() {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useAllOrders([OrderStatus.OPEN, OrderStatus.IN_PROGRESS]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Заказы
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              Заказы на производство
            </h1>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600 shadow-sm">
            {orders?.length ?? 0} всего
          </span>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Загрузка заказов...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось получить список заказов
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && (orders?.length ?? 0) === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Заказы не найдены.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {orders?.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Заказ №{order.orderNumber}
                  </p>
                  <Link
                    to={`/orderPage/${order.id}`}
                    className="block truncate text-lg font-semibold text-gray-900 transition hover:text-gray-700"
                  >
                    {order.label}
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/orderPage/${order.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
