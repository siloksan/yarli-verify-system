import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useAllFillingBucketActs } from '~/features/filling-bucket-acts';
import { Link } from 'react-router';
import { usePlatform } from '~/shared/hooks/usePlatform';

export default function FillingBucketActsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<
    'везде' | 'по компоненту' | 'по сотруднику' | 'по партии'
  >('везде');
  const { getUrl } = usePlatform();

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
        case 'по компоненту':
          return act.componentName.toLowerCase().includes(term);
        case 'по сотруднику':
          return act.workerName.toLowerCase().includes(term);
        case 'по партии':
          return act.componentBatch.toLowerCase().includes(term);
        case 'везде':
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
        <header className="rounded-3xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
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
                placeholder="Поиск по компоненту, партии, сотруднику"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchField('везде')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'везде' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Все
              </button>
              <button
                onClick={() => setSearchField('по компоненту')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'по компоненту' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Компонент
              </button>
              <button
                onClick={() => setSearchField('по партии')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'по партии' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Партия
              </button>
              <button
                onClick={() => setSearchField('по сотруднику')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'по сотруднику' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
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
              <span className="text-gray-500">Загрузка актов</span>
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
                Не найдено ни одного акта "{searchTerm}".
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchField('везде');
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
              <div className="overflow-x-auto">
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
            </div>
          )}
      </div>
    </div>
  );
}
