import { Link } from 'react-router';
import { usePlatform } from '~/shared/hooks/usePlatform';

export default function MainPage() {
  const { getUrl, isApp } = usePlatform();
  const sections = [
    {
      to: getUrl({
        appUrl: 'scanner:///orders',
        webUrl: 'orders',
      }),
      title: 'Заказы на производство',
      description: 'Актуальные партии и этапы выполнения',
      badge: 'Производство',
    },
    {
      to: getUrl({
        appUrl: 'scanner:///components',
        webUrl: 'components',
      }),
      title: 'Сырье и полуфабрикаты',
      description: 'Каталог компонентов и остатков',
      badge: 'Склад',
    },
    {
      to: getUrl({
        appUrl: 'scanner:///containers',
        webUrl: 'buckets',
      }),
      title: 'Емкости промежуточного хранения',
      description: 'Контроль статуса и доступных объемов',
      badge: 'Тара',
    },
    {
      to: getUrl({
        appUrl: 'scanner:///filling-acts',
        webUrl: 'filling-bucket-acts',
      }),
      title: 'Акты наполнения емкостей',
      description: 'Журнал операций и история заполнений',
      badge: 'Документы',
    },
    ...(isApp
      ? [
          {
            to: 'scanner:///scanner/fill-container',
            title: 'Заполнить емкость',
            description: 'Быстрый переход к сканированию и наполнению',
            badge: 'Сканер',
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_45%,#f1f5f9_100%)] p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-semibold text-slate-900">
            Главное меню
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Выберите раздел для работы с производством, складом и документами
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {section.badge}
              </span>
              <p className="mt-3 text-lg font-semibold text-slate-900 transition group-hover:text-blue-700">
                {section.title}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
