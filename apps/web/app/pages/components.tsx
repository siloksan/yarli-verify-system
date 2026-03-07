import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useAllComponents } from '~/features/components/hooks/components.hook';
import { usePlatform } from '~/shared/hooks/usePlatform';

type BarcodeState = {
  imageUrl: string;
  componentName: string;
  batch: string;
  ean13: string;
};

export default function ComponentsPage() {
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [barcodeState, setBarcodeState] = useState<BarcodeState | null>(null);
  const { getUrl } = usePlatform();

  const {
    data: components,
    isLoading,
    isError,
    error,
  } = useAllComponents(search || undefined);

  const totalBatchCount = useMemo(() => {
    return (components ?? []).reduce((sum, item) => {
      return sum + (item.batches?.length ?? 0);
    }, 0);
  }, [components]);

  const handlePrintBarcode = () => {
    if (!barcodeState || typeof window === 'undefined') {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      return;
    }

    const safeName = escapeHtml(barcodeState.componentName);
    const safeBatch = escapeHtml(barcodeState.batch);
    const safeImageUrl = escapeHtml(barcodeState.imageUrl);
    const safeEan13 = escapeHtml(barcodeState.ean13);

    printWindow.document.write(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>EAN-13 Label</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }
      .label {
        width: 420px;
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
        margin: 0 0 12px 0;
      }
      .barcode {
        width: 100%;
        max-width: 380px;
        height: auto;
      }
      .ean {
        margin: 12px 0 0 0;
        font-size: 18px;
        letter-spacing: 0.08em;
        font-weight: 700;
      }
      @media print {
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
      <img class="barcode" src="${safeImageUrl}" alt="EAN-13 barcode" />
      <p class="ean">${safeEan13}</p>
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
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Справочник сырья и полуфабрикатов
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Поиск по номенклатуре и партиям компонентов
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100">
              Номенклатур: {components?.length ?? 0} | Партий: {totalBatchCount}
            </div>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchInput.trim());
            }}
            className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"
          >
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Введите название компонента или номер партии"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              Найти
            </button>
          </form>
        </header>

        {isLoading && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Загрузка компонентов...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось получить список сырья и полуфабрикатов
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && (components?.length ?? 0) === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Сырье и полуфабрикаты не найдены.
          </div>
        )}

        <div className="grid gap-3">
          {components?.map((component) => {
            const isExpanded = expandedComponentId === component.id;

            return (
              <div
                key={component.id}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedComponentId((prev) =>
                      prev === component.id ? null : component.id,
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Компонент
                    </p>
                    <h2 className="mt-1 truncate font-semibold text-slate-900">
                      {component.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {component.batches.length} партий
                    </span>
                    <span
                      className={`text-sm font-semibold text-slate-500 transition ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 grid gap-2 border-t border-slate-200/80 pt-4">
                    {component.batches.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                        У компонента нет партий.
                      </div>
                    )}

                    {component.batches.map((batch) => {
                      const { barcode, batchNumber, id } = batch;
                      return (
                        <div
                          key={`${component.id}-${id}`}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Партия
                            </p>
                            <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                              {batchNumber}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setBarcodeState({
                                componentName: component.name,
                                batch: batchNumber,
                                ean13: barcode,
                                imageUrl: createEan13ImageUrl(barcode),
                              });
                            }}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Показать штрихкод
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {barcodeState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  EAN-13 данные
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {barcodeState.componentName}
                </h3>
                <p className="text-sm text-slate-500">
                  Партия: {barcodeState.batch}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBarcodeState(null)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Закрыть
              </button>
            </div>

            <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <img
                src={barcodeState.imageUrl}
                alt={`EAN-13 ${barcodeState.componentName} ${barcodeState.batch}`}
                className="w-full max-w-[340px]"
              />
            </div>

            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-center font-mono text-sm font-semibold tracking-wider text-slate-700">
              {barcodeState.ean13}
            </p>

            <button
              type="button"
              onClick={handlePrintBarcode}
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              Печать EAN-13
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

function createEan13ImageUrl(ean13: string) {
  return `https://quickchart.io/barcode?type=ean13&width=520&height=180&includeText=false&text=${encodeURIComponent(ean13)}`;
}
