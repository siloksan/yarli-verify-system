import { createWebPathToMobileApp } from '@repo/api';
import { Link } from 'react-router';
import { usePlatform } from '~/shared/hooks/usePlatform';

export default function MainPage() {
  const { getUrl } = usePlatform();
  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">Главное меню</h1>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={getUrl({
              appUrl: createWebPathToMobileApp('scanner:///orders'),
              webUrl: 'orders',
            })}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Заказы на производство
            </p>
          </Link>

          <Link
            to="/components"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Сырьё и полуфабрикаты
            </p>
          </Link>
          <Link
            to="/buckets"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Ёмкости промежуточного хранения
            </p>
          </Link>
          <Link
            to="/filling-bucket-acts"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Акты наполнения ёмкостей
            </p>
          </Link>

          <Link
            to={getUrl({
              appUrl: createWebPathToMobileApp(
                'scanner:///scanner/fill-container',
              ),
              webUrl: 'orders',
            })}
            to={createWebPathToMobileApp('scanner:///scanner/fill-container')}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Заполнить ёмкость
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
