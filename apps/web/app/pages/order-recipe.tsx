import { Link, useParams } from 'react-router';
import { ScanResult, type IOrderComponentDto } from '@repo/api';
import { useOrder } from '~/features/orders/hooks/orders.hook';

type ComponentStatus = 'unchecked' | 'ok' | 'wrong';

const statusStyles: Record<
  ComponentStatus,
  { badge: string; label: string; dot: string }
> = {
  unchecked: {
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Не проверено',
    dot: 'bg-gray-400',
  },
  ok: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Подтверждено',
    dot: 'bg-emerald-500',
  },
  wrong: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Не совпадает',
    dot: 'bg-rose-500',
  },
};

export default function OrderDetailsPage() {
  const { orderId } = useParams();

  if (!orderId) return null;

  const { data: order, isLoading, isError, error } = useOrder(orderId);
  const components: IOrderComponentDto[] = order?.components ?? [];

  const getStatus = (component: IOrderComponentDto): ComponentStatus => {
    const latestResult = component.scanEvents?.[0]?.result;
    if (latestResult === ScanResult.OK) return 'ok';
    if (latestResult === ScanResult.WRONG) return 'wrong';
    return 'unchecked';
  };

  const checkedCount = components.filter(
    (component) => getStatus(component) === 'ok',
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-700"
          >
            Назад к заказам
          </Link>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Заказ
              </p>
              <h1 className="text-2xl font-semibold text-gray-900">
                {order?.label ?? 'Рецептура'}
              </h1>
              <p className="text-sm text-gray-500">
                {order?.orderNumber
                  ? `Заказ №${order.orderNumber}`
                  : `ID ${orderId}`}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Прогресс
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {checkedCount} / {components.length}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
          {(['unchecked', 'ok', 'wrong'] as const).map((status) => (
            <div
              key={status}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusStyles[status].dot}`}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Статус
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {statusStyles[status].label}
                </p>
              </div>
            </div>
          ))}
        </section>

        {isLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Загрузка рецептуры...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось загрузить рецептуру
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && components.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Компоненты для этого заказа не найдены.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {components.map((component) => {
            const status = getStatus(component);
            const style = statusStyles[status];
            const batches = component.validBatches ?? [];
            const previewBatches = batches.slice(0, 3);
            const remainingCount = batches.length - previewBatches.length;

            return (
              <div
                key={component.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Компонент
                    </p>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {component.componentName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Требуется: {component.requiredQty} {component.unit ?? ''}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    {style.label}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {previewBatches.length === 0 && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500">
                        Партии не назначены
                      </span>
                    )}
                    {previewBatches.map((batch) => (
                      <span
                        key={batch}
                        className="rounded-full bg-gray-100 px-3 py-1 text-gray-600"
                      >
                        {batch}
                      </span>
                    ))}
                    {remainingCount > 0 && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                        +{remainingCount} ещё
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/orders/${orderId}/components/${component.id}/scan`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    Сканировать QR
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const generateDeepLink = (orderId: string, componentId: string) => {
  const callback = encodeURIComponent(`${window.location.origin}/orders/${orderId}/components/${componentId}/scan`);
  return `yourexpoapp://scan?orderId=${orderId}&componentId=${componentId}&callback=${callback}`;
};