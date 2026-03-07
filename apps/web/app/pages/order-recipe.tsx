import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import {
  ScanResult,
  type IOrderComponentDto,
  type IScanEvent,
} from '@repo/api';
import { useOrder } from '~/features/orders/hooks/orders.hook';
import { Component } from '~/features/order-recipe';
import { STATUS_STYLES } from '~/features/order-recipe/constants';
import type { ComponentStatus } from '~/features/order-recipe/types';
import { usePlatform } from '~/shared/hooks/usePlatform';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { data: order, isLoading, isError, error } = useOrder(orderId);
  const components: IOrderComponentDto[] = useMemo(
    () =>
      [...(order?.components ?? [])].sort(
        (first, second) => first.position - second.position,
      ),
    [order?.components],
  );
  const { getUrl } = usePlatform();
  console.log('order: ', order);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_45%,#f1f5f9_100%)] p-3 safe-padding sm:p-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-5">
        <header className="rounded-3xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
          <Link
            to={getUrl({
              appUrl: 'scanner:///orders',
              webUrl: '/orders',
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
            <span className="font-medium">К заказам на производство</span>
          </Link>

          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Заказ {order?.orderNumber ?? '...'}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
              {order?.label ?? 'Рецептура заказа'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Проверка компонентов и контроль сканирования партий
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-2 rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-sm sm:grid-cols-3 sm:gap-3 sm:p-4">
          {(['UNCHECKED', 'OK', 'WRONG'] as const).map((status) => (
            <div
              key={status}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[status].dot}`}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Статус
                </p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {STATUS_STYLES[status].label}
                </p>
              </div>
            </div>
          ))}
        </section>

        {isLoading && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Загрузка рецептуры...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось загрузить рецептуру
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && components.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Список компонентов для этого заказа не найден.
          </div>
        )}

        <div className="grid gap-3">
          {components.map((component) => {
            const {
              orderId,
              componentName,
              id: componentId,
              validBatches,
              scanEvents,
            } = component;
            const status = getStatus(scanEvents);

            return (
              <Component
                key={componentId}
                orderId={orderId}
                componentId={componentId}
                componentName={componentName}
                requiredQty={component.requiredQty}
                unit={component.unit}
                status={status}
                validBatches={validBatches}
                scanEvents={component.scanEvents ?? []}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getStatus(events: IScanEvent[] | undefined): ComponentStatus {
  if (!events || events.length === 0) return 'UNCHECKED';

  const isWrong = events.some((event) => event.result === ScanResult.WRONG);

  return isWrong ? ScanResult.WRONG : ScanResult.OK;
}
