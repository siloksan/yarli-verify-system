

export default function Unsupported() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Проверка устройства
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Устройство не поддерживается
          </h1>
          <p className="text-sm text-gray-500">
            Сканер работает только на Android в браузере Google Chrome.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 text-sm text-gray-600">
            <p>
              Пожалуйста, откройте эту страницу в Chrome на устройстве с
              Android.
            </p>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              Если у вас уже открыт Chrome, попробуйте обновить страницу.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
