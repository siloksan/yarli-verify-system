import { useMemo, useState } from 'react';
import { format } from 'date-fns';
// import { useAllFillingBucketActs, useCreateFillingBucketAct, useDeleteFillingBucketAct } from '../api/filling-bucket-acts';
// Uncomment and implement hooks above as needed

// DTO interfaces (copy from shared location if available)
interface IFillingActBucketResponseDto {
  id: string;
  componentName: string;
  componentBatch: string;
  workerName: string;
  weight: string | null;
  createdAt: string;
  bucketId: string;
  componentId: string;
  orderId: string;
}

interface ICreateFillingActBucketDto {
  batchId: string;
  componentId: string;
  workerName: string;
  weight: string | null;
  bucketId: string;
  orderId: string;
}

const FORM_ELEMENTS_NAME = {
  componentId: 'componentId',
  batchId: 'batchId',
  workerName: 'workerName',
  weight: 'weight',
  bucketId: 'bucketId',
  orderId: 'orderId',
};

export default function FillingBucketActsPage() {
  // State
  // const [error, setError] = useState('');
  // const [isFormOpen, setIsFormOpen] = useState(false);
  // const [isSubmitBtnActive, setIsSubmitBtnActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<
    'all' | 'component' | 'worker'
  >('all');

  // Data fetching hooks (replace with real hooks)
  const fillingActs: IFillingActBucketResponseDto[] = [];
  const fillingActsLoading = false;
  const fillingActsError = false;
  // const { data: fillingActs = [], isLoading: fillingActsLoading, isError: fillingActsError } = useAllFillingBucketActs();
  // const createFillingActMutation = useCreateFillingBucketAct();
  // const deleteFillingActMutation = useDeleteFillingBucketAct();

  // Filtered acts
  const filteredActs = useMemo(() => {
    if (!searchTerm.trim()) return fillingActs;
    const term = searchTerm.toLowerCase().trim();
    return fillingActs.filter((act) => {
      switch (searchField) {
        case 'component':
          return act.componentName.toLowerCase().includes(term);
        case 'worker':
          return act.workerName.toLowerCase().includes(term);
        case 'all':
        default:
          return (
            act.componentName.toLowerCase().includes(term) ||
            act.workerName.toLowerCase().includes(term) ||
            (act.weight ?? '').toString().toLowerCase().includes(term)
          );
      }
    });
  }, [fillingActs, searchTerm, searchField]);

  // Form creation logic removed

  // Table helpers
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Акты фасовки
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              Журнал фасовки по емкостям
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600 shadow-sm">
              {filteredActs.length} из {fillingActs.length} актов
            </span>
          </div>
        </header>

        {/* Create Form removed */}

        {/* Search Bar */}
        {!fillingActsLoading && !fillingActsError && fillingActs.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по компоненту или фасовщику..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSearchField('all')}
              >
                Все
              </button>
              <button
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'component' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSearchField('component')}
              >
                Компонент
              </button>
              <button
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'worker' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSearchField('worker')}
              >
                Фасовщик
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {fillingActsLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></span>
              <span className="text-gray-500">Загрузка актов...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {fillingActsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <div className="flex items-center gap-2">
              Не удалось загрузить список актов
            </div>
          </div>
        )}

        {/* Empty State */}
        {!fillingActsLoading &&
          !fillingActsError &&
          fillingActs.length === 0 && (
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
                Нет актов фасовки
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Нет данных для отображения
              </p>
            </div>
          )}

        {/* No Search Results */}
        {!fillingActsLoading &&
          !fillingActsError &&
          fillingActs.length > 0 &&
          filteredActs.length === 0 && (
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
                onClick={() => setSearchTerm('')}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                Сбросить поиск
              </button>
            </div>
          )}

        {/* Acts List - Table View */}
        {!fillingActsLoading &&
          !fillingActsError &&
          filteredActs.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Компонент
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Партия
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Фасовщик
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Вес
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Дата
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Статус
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredActs.map((act) => (
                      <tr key={act.id}>
                        <td className="px-4 py-2 text-xs text-gray-500">
                          {act.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {act.componentName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {act.componentBatch}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {act.workerName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {act.weight ?? '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {format(new Date(act.createdAt), 'dd.MM.yyyy')}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(act.createdAt)}`}
                          >
                            {getStatusText(act.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Card View */}
              <div className="divide-y divide-gray-200 md:hidden">
                {filteredActs.map((act) => (
                  <div key={act.id} className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">
                        {act.componentName}
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(act.createdAt)}`}
                      >
                        {getStatusText(act.createdAt)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {act.id.slice(0, 8)}...
                    </div>
                    <div className="text-sm">Партия: {act.componentBatch}</div>
                    <div className="text-sm">Фасовщик: {act.workerName}</div>
                    <div className="text-sm">Вес: {act.weight ?? '-'}</div>
                    <div className="text-sm">
                      Дата: {format(new Date(act.createdAt), 'dd.MM.yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
