import { useNativeFeatures } from '~/shared/hooks';
import { STATUS_STYLES } from '../constants';
import type { ComponentStatus } from '../types';
import type { IScanEvent } from '@repo/api';

interface Props {
  orderId: string;
  componentId: string;
  componentName: string;
  requiredQty: string;
  unit: string;
  status: ComponentStatus;
  validBatches: string[];
  scanEvents: IScanEvent[];
}

export function Component({
  orderId,
  componentId,
  componentName,
  requiredQty,
  unit,
  status,
  validBatches,
  scanEvents,
}: Props) {
  const { dot, label, badge } = STATUS_STYLES[status];

  const native = useNativeFeatures();

  return (
    <div
      key={componentId}
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-all `}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Компонент
          </p>
          <h2 className="text-lg font-semibold text-gray-900">
            {componentName}
          </h2>
          <p className="text-sm text-gray-500">
            Требуется: {requiredQty} {unit ?? ''}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          {label}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {validBatches.length === 0 && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500">
              Партии не назначены
            </span>
          )}
          {validBatches.map((batch) => (
            <span
              key={batch}
              className="rounded-full bg-gray-100 px-3 py-1 text-gray-600"
            >
              {batch}
            </span>
          ))}
        </div>

        <button
          onClick={() =>
            native?.sendMessageToApp({
              type: 'SCAN_COMPONENT',
              payload: {
                orderId,
                componentId,
                componentName,
                validBatches,
              },
            })
          }
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
                d="M4 5v14m3-14v14m2-14v14m4-14v14m2-14v14m3-14v14M3 5h18M3 19h18"
              />
            </svg>
            Сканировать код
          </span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-gray-500">
          Сканированные партии:
        </span>
        {scanEvents.length === 0 && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500">
            пока нет
          </span>
        )}
        {scanEvents.map((event) => {
          const backgroundColor =
            event.result === 'OK' ? 'bg-emerald-50' : 'bg-red-50';
          const textColor =
            event.result === 'OK' ? 'text-emerald-700' : 'text-red-700';

          return (
            <span
              key={`${componentId}-${event.id}`}
              className={`rounded-full ${backgroundColor} px-3 py-1 ${textColor}`}
            >
              {event.scannedComponentBatch
                ? event.scannedComponentBatch
                : 'не определено'}
            </span>
          );
        })}
      </div>
    </div>
  );
}
