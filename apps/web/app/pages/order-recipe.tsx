import { Link, useParams } from 'react-router';
import { useState } from 'react';
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
  const [pendingScan, setPendingScan] = useState<{
    componentId: string;
    batch?: string;
  } | null>(null);

  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const components: IOrderComponentDto[] = order?.components ?? [];

  // 🎯 **NAVIGATION LISTENER - Listen for return from Expo app**
  // useEffect(() => {
  //   // Check if we're returning from scanner with result in URL
  //   const handleNavigation = () => {
  //     const url = new URL(window.location.href);
  //     const scanResult = url.searchParams.get('scanResult');
  //     const scanError = url.searchParams.get('scanError');
  //     const componentId = url.searchParams.get('componentId');
  //     const batch = url.searchParams.get('batch');

  //     if (scanResult === 'success' && componentId) {
  //       // Show success toast
  //       const component = components.find((c) => c.id === componentId);

  //       // Store pending scan for optimistic update
  //       setPendingScan({
  //         componentId,
  //         batch: batch ? decodeURIComponent(batch) : undefined,
  //       });

  //       // Refresh order data
  //       refetch();

  //       // Clean URL parameters without page reload
  //       url.searchParams.delete('scanResult');
  //       url.searchParams.delete('scanError');
  //       url.searchParams.delete('componentId');
  //       url.searchParams.delete('batch');
  //       window.history.replaceState({}, '', url.toString());
  //     }

  //     if (scanError && componentId) {
  //       const component = components.find((c) => c.id === componentId);

  //       // Clean URL parameters
  //       url.searchParams.delete('scanResult');
  //       url.searchParams.delete('scanError');
  //       url.searchParams.delete('componentId');
  //       url.searchParams.delete('batch');
  //       window.history.replaceState({}, '', url.toString());
  //     }
  //   };

  //   // Listen for page visibility change (when returning from mobile app)
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible') {
  //       handleNavigation();
  //     }
  //   };

  //   // Listen for navigation events
  //   const handlePopState = () => {
  //     handleNavigation();
  //   };

  //   // Check immediately on mount
  //   handleNavigation();

  //   // Add event listeners
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   window.addEventListener('popstate', handlePopState);

  //   // Cleanup
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [orderId, components, refetch]);

  const getStatus = (component: IOrderComponentDto): ComponentStatus => {
    // Use optimistic status if available
    if (pendingScan?.componentId === component.id) {
      return 'ok';
    }

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
            to="/orderPage"
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
            const {
              orderId,
              componentName,
              id: componentId,
              validBatches,
            } = component;
            const status = getStatus(component);
            const style = statusStyles[status];
            const batches = component.validBatches ?? [];
            const previewBatches = batches.slice(0, 3);
            const remainingCount = batches.length - previewBatches.length;
            const isPending = pendingScan?.componentId === component.id;

            const scannerLink = generateDeepLink(
              orderId,
              componentId,
              componentName,
              validBatches,
            );

            return (
              <div
                key={component.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm transition-all ${
                  isPending
                    ? 'border-emerald-500 ring-2 ring-emerald-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Компонент
                    </p>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {component.componentName}
                      {isPending && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Обновление...
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Требуется: {component.requiredQty} {component.unit ?? ''}
                    </p>
                    {isPending && pendingScan?.batch && (
                      <p className="mt-1 text-sm text-emerald-600">
                        ✓ Отсканировано: партия {pendingScan.batch}
                      </p>
                    )}
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
                    to={scannerLink}
                    onClick={() => {
                      // Store that we're navigating to scanner
                      sessionStorage.setItem(
                        'scanning_component',
                        component.id,
                      );
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      Сканировать QR
                    </span>
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

const generateDeepLink = (
  orderId: string,
  componentId: string,
  componentName: string,
  validBatches: string[] = [],
) => {
  const callback = encodeURIComponent(
    `${window.location.origin}/orderPage/${orderId}`,
  );
  const batchesParam =
    validBatches.length > 0
      ? `&validBatches=${encodeURIComponent(JSON.stringify(validBatches))}`
      : '';

  return `scanner://scanner?orderId=${orderId}&componentId=${componentId}&callback=${callback}&componentName=${encodeURIComponent(componentName)}${batchesParam}`;
};
