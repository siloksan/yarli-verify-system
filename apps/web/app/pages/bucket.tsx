import { type FormEvent, useMemo, useState } from 'react';
import type { BucketQRData, IBucketCreateDto } from '@repo/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link } from 'react-router';
import { useAllBuckets, useCreateBucket } from '~/features/bucket';
import { useAllComponents } from '~/features/components';

const FORM_ELEMENTS_NAME = {
  component: 'component',
  creator: 'creator',
  location: 'location',
} as const;

export default function BucketsPage() {
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitBtnActive, setIsSubmitBtnActive] = useState(false);
  const [componentSearchTerm, setComponentSearchTerm] = useState('');
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [isComponentDropdownOpen, setIsComponentDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<
    'all' | 'component' | 'location'
  >('all');
  const [selectedBucket, setSelectedBucket] = useState<BucketQRData | null>(
    null,
  );
  const [showQRModal, setShowQRModal] = useState(false);

  const {
    data: buckets = [],
    isLoading: bucketsLoading,
    isError: bucketsError,
  } = useAllBuckets();

  const {
    data: components = [],
    isLoading: componentsLoading,
    isError: componentsError,
  } = useAllComponents();

  const createBucketMutation = useCreateBucket();

  const filteredComponents = useMemo(() => {
    const term = componentSearchTerm.trim().toLowerCase();

    if (!term) {
      return components;
    }

    return components.filter((component) =>
      component.name.toLowerCase().includes(term),
    );
  }, [componentSearchTerm, components]);

  const filteredBuckets = useMemo(() => {
    if (!searchTerm.trim()) return buckets;
    const term = searchTerm.toLowerCase().trim();

    return buckets.filter((bucket) => {
      if (searchField === 'component') {
        return bucket.component.name.toLowerCase().includes(term);
      }
      if (searchField === 'location') {
        return bucket.location?.toLowerCase().includes(term) || false;
      }
      return (
        bucket.component.name.toLowerCase().includes(term) ||
        bucket.creator.toLowerCase().includes(term) ||
        bucket.location?.toLowerCase().includes(term) ||
        false
      );
    });
  }, [buckets, searchField, searchTerm]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const componentId = formData.get(FORM_ELEMENTS_NAME.component) as
      | string
      | null;
    const creator = formData.get(FORM_ELEMENTS_NAME.creator) as string | null;
    const location = formData.get(FORM_ELEMENTS_NAME.location) as string | null;

    if (!componentId || !creator) {
      if (!componentId) {
        setError('Выберите компонент из списка');
      }
      return;
    }

    setIsSubmitBtnActive(true);

    const createBucketData: IBucketCreateDto = {
      componentId: componentId.trim(),
      creator: creator.trim(),
      ...(location && location.trim() ? { location: location.trim() } : {}),
    };

    createBucketMutation.mutate(createBucketData, {
      onSuccess: () => {
        form.reset();
        setComponentSearchTerm('');
        setSelectedComponentId('');
        setIsSubmitBtnActive(false);
        setIsFormOpen(false);
      },
      onError: (submitError) => {
        if (submitError instanceof Error) {
          setError(submitError.message);
        }
        setIsSubmitBtnActive(false);
      },
    });
  };

  const handleShowQR = (bucket: BucketQRData) => {
    setSelectedBucket(bucket);
    setShowQRModal(true);
  };

  const handlePrintQR = () => {
    if (!selectedBucket) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Разрешите всплывающие окна для печати');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Печать QR-кода - ${selectedBucket.componentName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .qr-container {
              text-align: center;
              padding: 30px;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              max-width: 400px;
              background: white;
            }
            .qr-image {
              width: 300px;
              height: 300px;
              margin: 0 auto 20px;
            }
            .qr-image img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .qr-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 8px;
              color: #111827;
            }
            .qr-subtitle {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 16px;
            }
            .qr-info {
              text-align: left;
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              margin: 16px 0;
            }
            .qr-info-item {
              display: flex;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .qr-info-label {
              width: 120px;
              color: #6b7280;
            }
            .qr-info-value {
              color: #111827;
              font-weight: 500;
            }
            .qr-footer {
              font-size: 12px;
              color: #9ca3af;
              margin-top: 16px;
            }
            @media print {
              body {
                padding: 0;
              }
              .qr-container {
                border: none;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-image">
              <img src="${createQrImageUrl(selectedBucket)}" alt="QR Code для ${selectedBucket.componentName}" />
            </div>
            <div class="qr-title">${selectedBucket.componentName}</div>
            <div class="qr-subtitle">ID: ${selectedBucket.id.slice(0, 8)}...</div>
            <div class="qr-info">
              <div class="qr-info-item">
                <span class="qr-info-label">Компонент:</span>
                <span class="qr-info-value">${selectedBucket.componentName}</span>
              </div>
              <div class="qr-info-item">
                <span class="qr-info-label">Создатель:</span>
                <span class="qr-info-value">${selectedBucket.creator}</span>
              </div>
              ${
                selectedBucket.location
                  ? `
              <div class="qr-info-item">
                <span class="qr-info-label">Расположение:</span>
                <span class="qr-info-value">${selectedBucket.location}</span>
              </div>
              `
                  : ''
              }
              <div class="qr-info-item">
                <span class="qr-info-label">Дата:</span>
                <span class="qr-info-value">${format(new Date(), 'dd.MM.yyyy')}</span>
              </div>
            </div>
            <div class="qr-footer">
              Сканируйте QR-код для получения информации о таре
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_45%,#f1f5f9_100%)] p-3 safe-padding sm:p-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-5">
        <header className="rounded-3xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
          <Link
            to="/"
            className="inline-flex text-sm font-semibold text-slate-500 transition hover:text-slate-700"
          >
            В главное меню
          </Link>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Емкости промежуточного хранения
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Управление тарой, печать QR-кодов и быстрый поиск
              </p>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
            >
              {isFormOpen ? 'Скрыть форму' : 'Добавить новую емкость'}
            </button>
          </div>
        </header>

        {isFormOpen && (
          <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Новая емкость
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="relative">
                <label className="text-sm font-medium text-slate-700">
                  Component
                </label>
                <input
                  type="text"
                  value={componentSearchTerm}
                  onChange={(event) => {
                    const value = event.target.value;
                    setComponentSearchTerm(value);
                    setIsComponentDropdownOpen(true);

                    const exactComponent = components.find(
                      (component) =>
                        component.name.toLowerCase() === value.trim().toLowerCase(),
                    );
                    setSelectedComponentId(exactComponent?.id ?? '');
                  }}
                  onFocus={() => setIsComponentDropdownOpen(true)}
                  onBlur={() => {
                    window.setTimeout(() => setIsComponentDropdownOpen(false), 120);
                  }}
                  placeholder="Type to search component"
                  disabled={componentsLoading}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
                <input
                  type="hidden"
                  name={FORM_ELEMENTS_NAME.component}
                  value={selectedComponentId}
                />
                {isComponentDropdownOpen && !componentsLoading && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {filteredComponents.map((component) => (
                      <button
                        key={component.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setComponentSearchTerm(component.name);
                          setSelectedComponentId(component.id);
                          setIsComponentDropdownOpen(false);
                        }}
                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        {component.name}
                      </button>
                    ))}
                    {filteredComponents.length === 0 && (
                      <p className="px-3 py-2 text-sm text-slate-500">
                        No matches found
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Сотрудник
                </label>
                <input
                  type="text"
                  name={FORM_ELEMENTS_NAME.creator}
                  required
                  placeholder="ФИО сотрудника"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Расположение
                </label>
                <input
                  type="text"
                  name={FORM_ELEMENTS_NAME.location}
                  placeholder="Стеллаж, ряд, место"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1 lg:grid-cols-1">
                <button
                  type="submit"
                  disabled={isSubmitBtnActive || componentsError}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {isSubmitBtnActive ? 'Создание...' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Отмена
                </button>
              </div>
            </form>
            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>
        )}

        {!bucketsLoading && !bucketsError && buckets.length > 0 && (
          <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Поиск по компоненту, сотруднику или расположению"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setSearchField('all')}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    searchField === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Везде
                </button>
                <button
                  type="button"
                  onClick={() => setSearchField('component')}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    searchField === 'component'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  По компоненту
                </button>
                <button
                  type="button"
                  onClick={() => setSearchField('location')}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    searchField === 'location'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  По расположению
                </button>
              </div>
            </div>
          </section>
        )}

        {bucketsLoading && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Загрузка емкостей...
          </div>
        )}

        {bucketsError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось загрузить список емкостей
          </div>
        )}

        {!bucketsLoading && !bucketsError && buckets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
            Емкости не найдены. Создайте первую емкость, чтобы начать работу.
          </div>
        )}

        {!bucketsLoading &&
          !bucketsError &&
          buckets.length > 0 &&
          filteredBuckets.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-slate-500">
              По запросу «{searchTerm}» ничего не найдено.
            </div>
          )}

        {!bucketsLoading && !bucketsError && filteredBuckets.length > 0 && (
          <div className="grid gap-3">
            {filteredBuckets.map((bucket) => (
              <article
                key={bucket.id}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Емкость
                    </p>
                    <h3 className="mt-1 truncate text-lg font-semibold text-slate-900 sm:text-xl">
                      {bucket.component.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Занес в систему:{' '}
                      <span className="font-medium">{bucket.creator}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(bucket.createdAt)}`}
                    >
                      {getStatusText(bucket.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleShowQR({
                          id: bucket.id,
                          componentName: bucket.component.name,
                          componentId: bucket.component.id,
                          creator: bucket.creator,
                          location: bucket.location,
                        })
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      QR-код
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Расположение
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {bucket.location || 'Не указано'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Дата создания
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {format(
                        new Date(bucket.createdAt),
                        'dd MMM yyyy, HH:mm',
                        {
                          locale: ru,
                        },
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showQRModal && selectedBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  QR данные
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {selectedBucket.componentName}
                </h3>
                <p className="text-sm text-slate-500">
                  ID: {selectedBucket.id.slice(0, 8)}...
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Закрыть
              </button>
            </div>

            <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <img
                src={createQrImageUrl({
                  id: selectedBucket.id,
                  componentId: selectedBucket.componentId,
                  componentName: selectedBucket.componentName,
                  creator: selectedBucket.creator,
                  location: selectedBucket.location || '',
                })}
                alt={`QR код для ${selectedBucket.componentName}`}
                className="h-64 w-64"
              />
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Создатель:</span>{' '}
                {selectedBucket.creator}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Расположение:</span>{' '}
                {selectedBucket.location || 'Не указано'}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrintQR}
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              Печать QR-кода
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function createQrImageUrl(qrData: BucketQRData) {
  const qrDataString = JSON.stringify(qrData);

  return `https://quickchart.io/qr?text=${encodeURIComponent(qrDataString)}&size=520&margin=1&dark=000000&light=ffffff`;
}

function getStatusColor(createdAt: string) {
  const daysOld = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysOld < 7) return 'bg-green-100 text-green-800';
  if (daysOld < 30) return 'bg-amber-100 text-amber-800';
  return 'bg-orange-100 text-orange-800';
}

function getStatusText(createdAt: string) {
  const daysOld = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysOld === 0) return 'Сегодня';
  if (daysOld === 1) return 'Вчера';
  if (daysOld < 30) return `${daysOld} дн.`;
  return `${Math.floor(daysOld / 30)} мес.`;
}
