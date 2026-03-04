import { Link } from 'react-router';

export default function Unsupported() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Страница не найдена или находится в разработке
          </h1>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 text-sm text-gray-600">
            <Link to="/">Вернуться в главное меню.</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
