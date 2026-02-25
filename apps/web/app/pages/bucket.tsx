import React, { useState, useMemo, useRef } from 'react';
import type { BucketQRData, IBucketCreateDto } from '@repo/api';
import { useAllBuckets, useCreateBucket } from '~/features/bucket';
import { useAllComponents } from '~/features/components';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const FORM_ELEMENTS_NAME = {
  component: 'component',
  creator: 'creator',
  location: 'location',
};

export default function BucketsPage() {
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitBtnActive, setIsSubmitBtnActive] = useState(false);
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<
    'all' | 'component' | 'location'
  >('all');
  // QR state
  const [selectedBucket, setSelectedBucket] = useState<BucketQRData | null>(
    null,
  );
  const [showQRModal, setShowQRModal] = useState(false);
  const qrPrintRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const componentName = formData.get(FORM_ELEMENTS_NAME.component) as
      | string
      | null;
    const creator = formData.get(FORM_ELEMENTS_NAME.creator) as string | null;
    const location = formData.get(FORM_ELEMENTS_NAME.location) as string | null;

    if (componentName && creator) {
      setIsSubmitBtnActive(true);

      const createBucketData: IBucketCreateDto = {
        componentName: componentName.trim(),
        creator: creator.trim(),
        ...(location && location.trim() ? { location: location.trim() } : {}),
      };

      createBucketMutation.mutate(createBucketData, {
        onSuccess: () => {
          console.log('Тара успешно создана');
          form.reset();
          setIsSubmitBtnActive(false);
          setIsFormOpen(false);
        },
        onError: (error) => {
          console.error('Ошибка при создании:', error);
          if (error instanceof Error) {
            setError(error.message);
          }
          setIsSubmitBtnActive(false);
        },
      });
    } else {
      console.error('Пожалуйста, заполните обязательные поля');
    }
  };

  // Filter buckets based on search
  const filteredBuckets = useMemo(() => {
    if (!searchTerm.trim()) return buckets;

    return buckets.filter((bucket) => {
      const term = searchTerm.toLowerCase().trim();

      switch (searchField) {
        case 'component':
          return bucket.componentName.toLowerCase().includes(term);
        case 'location':
          return bucket.location?.toLowerCase().includes(term) || false;
        case 'all':
        default:
          return (
            bucket.componentName.toLowerCase().includes(term) ||
            bucket.creator.toLowerCase().includes(term) ||
            bucket.location?.toLowerCase().includes(term) ||
            false
          );
      }
    });
  }, [buckets, searchTerm, searchField]);

  const getStatusColor = (createdAt: string) => {
    const daysOld = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysOld < 7) return 'bg-green-100 text-green-800';
    if (daysOld < 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getStatusText = (createdAt: string) => {
    const daysOld = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysOld === 0) return 'Сегодня';
    if (daysOld === 1) return 'Вчера';
    if (daysOld < 7) return `${daysOld} дн.`;
    if (daysOld < 30) return `${daysOld} дн.`;
    return `${Math.floor(daysOld / 30)} мес.`;
  };

  const handleShowQR = (bucket: BucketQRData) => {
    setSelectedBucket(bucket);
    setShowQRModal(true);
  };

  const handlePrintQR = () => {
    if (!qrPrintRef.current || !selectedBucket) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Пожалуйста, разрешите всплывающие окна для печати');
      return;
    }

    const qrData = JSON.stringify({
      id: selectedBucket.id,
      component: selectedBucket.componentName,
      creator: selectedBucket.creator,
      location: selectedBucket.location || '',
      date: new Date().toISOString(),
    });

    const qrImageUrl = createQrImageUrl(qrData);

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
              width: 100px;
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
              <img src="${qrImageUrl}" alt="QR Code для ${selectedBucket.componentName}" />
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

  const createQrImageUrl = (qrData: string) => {
    return `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=520&margin=1&dark=000000&light=ffffff`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Склад
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              Тара с компонентами
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600 shadow-sm">
              {filteredBuckets.length} из {buckets.length} емкостей
            </span>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Добавить тару
            </button>
          </div>
        </header>

        {/* Create Form - Collapsible */}
        {isFormOpen && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Новая емкость
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Компонент
                </label>
                <select
                  name={FORM_ELEMENTS_NAME.component}
                  required
                  disabled={componentsLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {componentsLoading ? 'Загрузка...' : 'Выберите компонент'}
                  </option>
                  {components.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Создатель
                </label>
                <input
                  type="text"
                  name={FORM_ELEMENTS_NAME.creator}
                  required
                  placeholder="ФИО сотрудника"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Расположение
                </label>
                <input
                  type="text"
                  name={FORM_ELEMENTS_NAME.location}
                  placeholder="Стеллаж, ряд, место"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={isSubmitBtnActive}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSubmitBtnActive ? 'Создание...' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Отмена
                </button>
              </div>
            </form>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        {!bucketsLoading && !bucketsError && buckets.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по компоненту или расположению..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSearchField('all')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  searchField === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Везде
              </button>
              <button
                onClick={() => setSearchField('component')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  searchField === 'component'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                По компоненту
              </button>
              <button
                onClick={() => setSearchField('location')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  searchField === 'location'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                По расположению
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {bucketsLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500">Загрузка емкостей...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {bucketsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Не удалось загрузить список емкостей
            </div>
          </div>
        )}

        {/* Empty State */}
        {!bucketsLoading && !bucketsError && buckets.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Нет емкостей
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Начните с добавления новой тары с компонентом
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Добавить первую емкость
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!bucketsLoading &&
          !bucketsError &&
          buckets.length > 0 &&
          filteredBuckets.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Ничего не найдено
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                По запросу «{searchTerm}» ничего не найдено
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchField('all');
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                Сбросить поиск
              </button>
            </div>
          )}

        {/* Buckets List - Card View for Mobile, Table for Desktop */}
        {!bucketsLoading && !bucketsError && filteredBuckets.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Компонент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Создатель
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Расположение
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Дата создания
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredBuckets.map((bucket) => (
                    <tr key={bucket.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {bucket.componentName}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {bucket.creator}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {bucket.location ? (
                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {bucket.location}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {format(
                            new Date(bucket.createdAt),
                            'dd MMM yyyy, HH:mm',
                            { locale: ru },
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(bucket.createdAt)}`}
                        >
                          {getStatusText(bucket.createdAt)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() =>
                            handleShowQR({
                              id: bucket.id,
                              componentName: bucket.componentName,
                              creator: bucket.creator,
                              location: bucket.location,
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100"
                          title="Показать QR-код"
                        >
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
                          QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="divide-y divide-gray-200 md:hidden">
              {filteredBuckets.map((bucket) => (
                <div key={bucket.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {bucket.componentName}
                      </p>
                      <div className="space-y-1">
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {bucket.creator}
                        </p>
                        {bucket.location && (
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {bucket.location}
                          </p>
                        )}
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {format(new Date(bucket.createdAt), 'dd MMM yyyy', {
                            locale: ru,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(bucket.createdAt)}`}
                      >
                        {getStatusText(bucket.createdAt)}
                      </span>
                      <button
                        onClick={() =>
                          handleShowQR({
                            id: bucket.id,
                            componentName: bucket.componentName,
                            creator: bucket.creator,
                            location: bucket.location,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 transition hover:bg-purple-100"
                      >
                        <svg
                          className="h-3.5 w-3.5"
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
                        QR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            ref={qrPrintRef}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                QR-код для тары
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center">
              {/* QR Code Image */}
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                <img
                  src={createQrImageUrl(
                    JSON.stringify({
                      id: selectedBucket.id,
                      component: selectedBucket.componentName,
                      creator: selectedBucket.creator,
                      location: selectedBucket.location || '',
                      date: new Date().toISOString(),
                    }),
                  )}
                  alt={`QR код для ${selectedBucket.componentName}`}
                  className="h-64 w-64"
                />
              </div>

              {/* Bucket Info */}
              <div className="mb-6 w-full space-y-2 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Компонент:</span>{' '}
                  {selectedBucket.componentName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Создатель:</span>{' '}
                  {selectedBucket.creator}
                </p>
                {selectedBucket.location && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Расположение:</span>{' '}
                    {selectedBucket.location}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ID:</span>{' '}
                  {selectedBucket.id.slice(0, 8)}...
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full gap-3">
                <button
                  onClick={handlePrintQR}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <span className="flex items-center justify-center gap-2">
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
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Печать
                  </span>
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function createQrImageUrl(qrData: string) {
  return `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=520&margin=1&dark=000000&light=ffffff`;
}
