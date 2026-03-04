import { Link, useParams } from 'react-router';
import { useMemo } from 'react';
import {
  ScanResult,
  type IOrderComponentDto,
  type IScanEvent,
} from '@repo/api';
import { useOrder } from '~/features/orders/hooks/orders.hook';
import { Component } from '~/features/order-recipe';
import { STATUS_STYLES } from '~/features/order-recipe/constants';
import type { ComponentStatus } from '~/features/order-recipe/types';

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <Link
            to="/orders"
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-700"
          >
            Назад к заказам на производство
          </Link>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Заказ на производство {order?.orderNumber}
              </p>
              <h1 className="text-2xl font-semibold text-gray-900">
                {order?.label}
              </h1>
            </div>
          </div>
        </header>

        <section className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
          {(['UNCHECKED', 'OK', 'WRONG'] as const).map((status) => (
            <div
              key={status}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[status].dot}`}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Статус
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {STATUS_STYLES[status].label}
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
            Список компонентов для этого заказа не найден.
          </div>
        )}

        <div className="flex flex-col gap-3">
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
