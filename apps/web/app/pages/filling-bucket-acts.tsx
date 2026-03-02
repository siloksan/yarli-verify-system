import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  useAllFillingBucketActs,
  useCreateFillContainerAct,
} from '~/features/filling-bucket-acts';
import { useAllBuckets } from '~/features/bucket';

const FORM_ELEMENTS_NAME = {
  bucketId: 'bucketId',
  workerName: 'workerName',
  componentBarcode: 'componentBarcode',
  weight: 'weight',
};

export default function FillingBucketActsPage() {
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitBtnActive, setIsSubmitBtnActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<
    'all' | 'component' | 'worker' | 'batch'
  >('all');

  const {
    data: fillingActs = [],
    isLoading: fillingActsLoading,
    isError: fillingActsError,
  } = useAllFillingBucketActs();
  const {
    data: buckets = [],
    isLoading: bucketsLoading,
    isError: bucketsError,
  } = useAllBuckets();
  const createFillContainerActMutation = useCreateFillContainerAct();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const bucketId = (formData.get(FORM_ELEMENTS_NAME.bucketId) as string | null)
      ?.trim();
    const workerName = (
      formData.get(FORM_ELEMENTS_NAME.workerName) as string | null
    )?.trim();
    const componentBarcode = (
      formData.get(FORM_ELEMENTS_NAME.componentBarcode) as string | null
    )?.trim();
    const weight = (formData.get(FORM_ELEMENTS_NAME.weight) as string | null)
      ?.trim();

    if (!bucketId || !workerName || !componentBarcode) {
      setError('Fill required fields: bucket, worker name and component barcode.');
      return;
    }

    setError('');
    setIsSubmitBtnActive(true);

    createFillContainerActMutation.mutate(
      {
        bucketId,
        data: {
          workerName,
          componentBarcode,
          ...(weight ? { weight } : {}),
        },
      },
      {
        onSuccess: () => {
          form.reset();
          setIsSubmitBtnActive(false);
          setIsFormOpen(false);
        },
        onError: (submitError) => {
          if (submitError instanceof Error) {
            setError(submitError.message);
          } else {
            setError('Failed to create filling act.');
          }
          setIsSubmitBtnActive(false);
        },
      },
    );
  };

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
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Filling Acts
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              Bucket Filling Journal
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600 shadow-sm">
              {filteredActs.length} of {fillingActs.length} acts
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
              Create Act
            </button>
          </div>
        </header>

        {isFormOpen && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              New Filling Act
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Bucket</label>
                <select
                  name={FORM_ELEMENTS_NAME.bucketId}
                  required
                  disabled={bucketsLoading || bucketsError}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {bucketsLoading ? 'Loading...' : 'Select bucket'}
                  </option>
                  {buckets.map((bucket) => (
                    <option key={bucket.id} value={bucket.id}>
                      {bucket.component.name} ({bucket.id.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Worker Name
                </label>
                <input
                  type="text"
                  name={FORM_ELEMENTS_NAME.workerName}
                  required
                  placeholder="Operator name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Component Barcode
                </label>
                <input
                  type="text"
                  name={FORM_ELEMENTS_NAME.componentBarcode}
                  required
                  placeholder="Scan or input barcode"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Weight (optional)
                </label>
                <input
                  type="text"
                  name={FORM_ELEMENTS_NAME.weight}
                  placeholder="e.g. 25.300"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end gap-2 md:col-span-2 lg:col-span-4">
                <button
                  type="submit"
                  disabled={
                    isSubmitBtnActive || bucketsLoading || buckets.length === 0
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSubmitBtnActive ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {!bucketsLoading && buckets.length === 0 && (
              <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
                No buckets available. Create a bucket first.
              </div>
            )}
          </div>
        )}

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
                All
              </button>
              <button
                onClick={() => setSearchField('component')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'component' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Component
              </button>
              <button
                onClick={() => setSearchField('batch')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Batch
              </button>
              <button
                onClick={() => setSearchField('worker')}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${searchField === 'worker' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Worker
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
            Failed to load filling acts.
          </div>
        )}

        {!fillingActsLoading && !fillingActsError && fillingActs.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No filling acts yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create the first act using the button above.
            </p>
          </div>
        )}

        {!fillingActsLoading &&
          !fillingActsError &&
          fillingActs.length > 0 &&
          filteredActs.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No matches found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Nothing found for "{searchTerm}".
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchField('all');
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                Reset search
              </button>
            </div>
          )}

        {!fillingActsLoading && !fillingActsError && filteredActs.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Component
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Batch
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Worker
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
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
                  <div className="text-sm">Batch: {act.componentBatch}</div>
                  <div className="text-sm">Worker: {act.workerName}</div>
                  <div className="text-sm">Weight: {act.weight ?? '-'}</div>
                  <div className="text-sm">
                    Date: {format(new Date(act.createdAt), 'dd.MM.yyyy')}
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

function getStatusColor(createdAt: string) {
  const daysOld = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysOld < 7) return 'bg-green-100 text-green-800';
  if (daysOld < 30) return 'bg-yellow-100 text-yellow-800';
  return 'bg-orange-100 text-orange-800';
}

function getStatusText(createdAt: string) {
  const daysOld = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysOld === 0) return 'Today';
  if (daysOld === 1) return 'Yesterday';
  if (daysOld < 30) return `${daysOld} d`;
  return `${Math.floor(daysOld / 30)} mo`;
}
