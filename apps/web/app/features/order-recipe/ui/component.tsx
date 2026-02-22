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
  const scannedBatchesFromEvents = Array.from(
    new Set(
      scanEvents.map((event) => {
        if (event.scannedComponentBatch) {
          return event.scannedComponentBatch;
        } else {
          return 'не определено';
        }
      }),
    ),
  );

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
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            Сканировать QR
          </span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-gray-500">
          Сканированные партии:
        </span>
        {scannedBatchesFromEvents.length === 0 && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500">
            пока нет
          </span>
        )}
        {scannedBatchesFromEvents.map((batch) => (
          <span
            key={`${componentId}-${batch}`}
            className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700"
          >
            {batch}
          </span>
        ))}
      </div>
    </div>
  );
}
