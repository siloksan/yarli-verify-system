import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useAllFillingBucketActs } from '~/features/filling-bucket-acts';

export default function FillingBucketActsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<
    'all' | 'component' | 'worker' | 'batch'
  >('all');

  const {
    data: fillingActs = [],
    isLoading: fillingActsLoading,
    isError: fillingActsError,
  } = useAllFillingBucketActs();

  const filteredActs = useMemo(() => {
    if (!searchTerm.trim()) return fillingActs;
    const term = searchTerm.toLowerCase().trim();

    return fillingActs.filter((act) => {
      switch (searchField) {
        case 'component':
          return act.componentName.toLowerCase().includes(term);
        case 'worker':
          return act.workerName.toLowerCase().includes(term);
        case 'batch':
          return act.componentBatch.toLowerCase().includes(term);
        case 'all':
        default:
          return (
            act.componentName.toLowerCase().includes(term) ||
            act.workerName.toLowerCase().includes(term) ||
            act.componentBatch.toLowerCase().includes(term) ||
            act.bucketId.toLowerCase().includes(term) ||
            (act.weight ?? '').toLowerCase().includes(term)
          );
      }
    });
  }, [fillingActs, searchTerm, searchField]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Акты заполнения емкостей
            </h1>
          </div>
        </header>

        {!fillingActsLoading && !fillingActsError && fillingActs.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by component, batch, worker, bucket id..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSearchField('all')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Все
              </button>
              <button
                onClick={() => setSearchField('component')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'component' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Компонент
              </button>
              <button
                onClick={() => setSearchField('batch')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Партия
              </button>
              <button
                onClick={() => setSearchField('worker')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'worker' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Заполняющий
              </button>
            </div>
          </div>
        )}

        {fillingActsLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></span>
              <span className="text-gray-500">Loading acts...</span>
            </div>
          </div>
        )}

        {fillingActsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось выгрузить список актов
          </div>
        )}

        {!fillingActsLoading &&
          !fillingActsError &&
          fillingActs.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                На данный момент ёмкости не заполнялись
              </h3>
            </div>
          )}

        {!fillingActsLoading &&
          !fillingActsError &&
          fillingActs.length > 0 &&
          filteredActs.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Нет совпадений
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Не найдено ни одного акта по поску "{searchTerm}".
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

        {!fillingActsLoading &&
          !fillingActsError &&
          filteredActs.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Компонент
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Партия
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Заполняющий сотрудник
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Вес
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Дата
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredActs.map((act) => (
                      <tr key={act.id}>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className="divide-y divide-gray-200 md:hidden">
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
                    <div className="text-sm">Batch: {act.componentBatch}</div>
                    <div className="text-sm">Worker: {act.workerName}</div>
                    <div className="text-sm">Weight: {act.weight ?? '-'}</div>
                    <div className="text-sm">
                      Date: {format(new Date(act.createdAt), 'dd.MM.yyyy')}
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          )}
      </div>
    </div>
  );
}

// function getStatusColor(createdAt: string) {
//   const daysOld = Math.floor(
//     (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
//   );
//   if (daysOld < 7) return 'bg-green-100 text-green-800';
//   if (daysOld < 30) return 'bg-yellow-100 text-yellow-800';
//   return 'bg-orange-100 text-orange-800';
// }

// function getStatusText(createdAt: string) {
//   const daysOld = Math.floor(
//     (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
//   );
//   if (daysOld === 0) return 'Today';
//   if (daysOld === 1) return 'Yesterday';
//   if (daysOld < 30) return `${daysOld} d`;
//   return `${Math.floor(daysOld / 30)} mo`;
// }
