import { type IComponentBatchQrPayload, type IComponentDto } from '@repo/api';
import { Link } from 'react-router';
import { useMemo, useState } from 'react';
import { useAllComponents } from '~/features/components/hooks/components.hook';

type QrState = {
  imageUrl: string;
  payload: string;
  componentName: string;
  batch: string;
};

export default function ComponentsPage() {
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [qrState, setQrState] = useState<QrState | null>(null);

  const { data: components, isLoading, isError, error } = useAllComponents(
    search || undefined,
  );

  const totalBatchCount = useMemo(() => {
    return (components ?? []).reduce((sum, item) => {
      return sum + (item.batches?.length ?? 0);
    }, 0);
  }, [components]);

  const handlePrintQr = () => {
    if (!qrState || typeof window === 'undefined') {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=800');
    if (!printWindow) {
      return;
    }

    const safeName = escapeHtml(qrState.componentName);
    const safeBatch = escapeHtml(qrState.batch);
    const safeImageUrl = escapeHtml(qrState.imageUrl);

    printWindow.document.write(`
<!doctype html>
<html>
  <head>  
    <meta charset="utf-8" />
    <title>QR Label</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }
      .label {
        width: 320px;
        margin: 24px auto;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
      }
      .name {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 8px 0;
      }
      .batch {
        font-size: 16px;
        margin: 0 0 16px 0;
      }
      .qr {
        width: 260px;
        height: 260px;
      }
      @media print {
        body {
          margin: 0;
        }
        .label {
          border: none;
          margin: 0 auto;
          width: auto;
        }
      }
    </style>
  </head>
  <body>
    <div class="label">
      <p class="name">${safeName}</p>
      <p class="batch">Batch: ${safeBatch}</p>
      <img class="qr" src="${safeImageUrl}" alt="QR code" />
    </div>
    <script>
      window.onload = () => {
        window.print();
        window.onafterprint = () => window.close();
      };
    </script>
  </body>
</html>`);
    printWindow.document.close();
  };

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
                Компоненты
              </p>
              <h1 className="text-2xl font-semibold text-gray-900">
                Справочник компонентов
              </h1>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Всего
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {components?.length ?? 0} компонентов
              </p>
              <p className="text-sm text-gray-500">{totalBatchCount} партий</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchInput.trim());
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Поиск по имени, коду или партии"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-400"
            />
            <button
              type="submit"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Найти
            </button>
          </form>
        </section>

        {isLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Загрузка компонентов...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось загрузить компоненты
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && (components?.length ?? 0) === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Компоненты не найдены.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {components?.map((component) => {
            const isExpanded = expandedComponentId === component.id;

            return (
              <div
                key={component.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedComponentId((prev) =>
                      prev === component.id ? null : component.id,
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Компонент
                    </p>
                    <h2 className="truncate text-lg font-semibold text-gray-900">
                      {component.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {component.batches.length} партий
                    </span>
                    <span
                      className={`text-xs font-semibold text-gray-500 transition ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
                    {component.batches.length === 0 && (
                      <div className="rounded-xl border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                        Для компонента нет партий.
                      </div>
                    )}

                    {component.batches.map((batch) => (
                      <div
                        key={`${component.id}-${batch}`}
                        className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Партия
                          </p>
                          <p className="truncate text-sm font-semibold text-gray-700">
                            {batch}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const payload = buildBatchQrPayload(component, batch);
                            const payloadString = JSON.stringify(payload);
                            setQrState({
                              payload: payloadString,
                              componentName: component.name,
                              batch,
                              imageUrl: createQrImageUrl(payloadString),
                            });
                          }}
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
                        >
                          Создать QR
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {qrState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  QR данные
                </p>
                <h3 className="text-base font-semibold text-gray-900">
                  {qrState.componentName}
                </h3>
                <p className="text-sm text-gray-500">Партия: {qrState.batch}</p>
              </div>
              <button
                type="button"
                onClick={() => setQrState(null)}
                className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Закрыть
              </button>
            </div>

            <div className="flex justify-center rounded-xl border border-gray-200 bg-gray-50 p-3">
              <img
                src={qrState.imageUrl}
                alt={`QR ${qrState.componentName} ${qrState.batch}`}
                className="h-52 w-52"
              />
            </div>

            <p className="mt-3 break-all rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
              {qrState.payload}
            </p>

            <button
              type="button"
              onClick={handlePrintQr}
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
            >
              Print QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildBatchQrPayload(
  component: IComponentDto,
  batch: string,
): IComponentBatchQrPayload {
  return {
    batchId: `${component.id}:${batch}`,
    batch,
    componentId: component.id,
    componentName: component.name,
  };
}

function createQrImageUrl(payload: string) {
  return `https://quickchart.io/qr?size=260&text=${encodeURIComponent(payload)}`;
}
