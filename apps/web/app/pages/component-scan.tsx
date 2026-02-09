import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { useOrder } from '~/features/orders/hooks/orders.hook';
import { isAndroidChrome } from '~/shared/lib/guards';

type ScanState = 'idle' | 'ok' | 'wrong' | 'error';

const QR_READER_ID = 'qr-reader';

const scanStateStyles: Record<
  ScanState,
  { badge: string; label: string; description: string }
> = {
  idle: {
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Ожидание',
    description: 'Наведите камеру на QR-код партии.',
  },
  ok: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Совпадает',
    description: 'QR-код соответствует допустимым партиям.',
  },
  wrong: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Не совпадает',
    description: 'QR-код не найден в списке допустимых партий.',
  },
  error: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Ошибка',
    description: 'Не удалось распознать QR-код.',
  },
};

export default function ComponentScanPage() {
  const { orderId, componentId } = useParams();
  const { data: order, isLoading, isError, error } = useOrder(orderId);

  const component = useMemo(
    () => order?.components?.find((item) => item.id === componentId),
    [order, componentId],
  );

  const validBatches = component?.validBatches ?? [];

  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanValue, setScanValue] = useState('');
  const [manualValue, setManualValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);

  const qrCodeRef = useRef<Html5Qrcode | null>(null);

  const stopCamera = async () => {
    if (!qrCodeRef.current) {
      setIsCameraOn(false);
      return;
    }

    try {
      await qrCodeRef.current.stop();
    } catch (err) {
      // ignore stop errors
    }

    try {
      await qrCodeRef.current.clear();
    } catch (err) {
      // ignore clear errors
    }

    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, []);

  if (typeof window !== 'undefined' && !isAndroidChrome()) {
    return <Navigate to="/unsupported" replace />;
  }

  const handleScan = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    setScanValue(normalized);
    setScanState(validBatches.includes(normalized) ? 'ok' : 'wrong');
    setErrorMessage('');
  };

  const startCamera = async () => {
    if (typeof window === 'undefined') return;
    if (isCameraOn) return;

    try {
      if (!qrCodeRef.current) {
        qrCodeRef.current = new Html5Qrcode(QR_READER_ID);
      }

      await qrCodeRef.current.start(
        { facingMode: { ideal: 'environment' } },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          handleScan(decodedText);
          void stopCamera();
        },
        () => {
          // ignore scan errors to avoid noisy UI
        },
      );

      setIsCameraOn(true);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Не удалось запустить камеру. Проверьте разрешения.');
      setScanState('error');
      await stopCamera();
    }
  };

  const resetScan = () => {
    setScanState('idle');
    setScanValue('');
    setManualValue('');
    setErrorMessage('');
  };

  const handleManualSubmit = () => {
    const value = manualValue.trim();
    if (!value) {
      setErrorMessage('Введите код партии.');
      return;
    }
    handleScan(value);
  };

  if (!orderId || !componentId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 safe-padding">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Некорректная ссылка для сканирования.
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-700"
          >
            Вернуться к заказам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <Link
            to={`/orders/${orderId}`}
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-700"
          >
            Назад к рецептуре
          </Link>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Сканирование
              </p>
              <h1 className="text-2xl font-semibold text-gray-900">
                Проверка QR-кода компонента
              </h1>
              <p className="text-sm text-gray-500">
                Заказ: {order?.label ?? orderId}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                scanStateStyles[scanState].badge
              }`}
            >
              {scanStateStyles[scanState].label}
            </span>
          </div>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Загрузка данных...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось загрузить данные о заказе
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && !component && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Компонент не найден в рецептуре.
          </div>
        )}

        {component && (
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Компонент
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              {component.componentName}
            </h2>
            <p className="text-sm text-gray-500">
              Требуется: {component.requiredQty} {component.unit ?? ''}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {validBatches.length === 0 && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500">
                  Допустимые партии не указаны
                </span>
              )}
              {validBatches.map((batch) => (
                <span
                  key={batch}
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-600"
                >
                  {batch}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Камера устройства
                </p>
                <p className="text-sm text-gray-500">
                  {scanStateStyles[scanState].description}
                </p>
              </div>
              {scanValue && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {scanValue}
                </span>
              )}
            </div>

            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-900">
              <div id={QR_READER_ID} className="h-56 w-full" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-44 w-44">
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/80 shadow-[0_0_0_999px_rgba(0,0,0,0.35)]" />
                  <span className="absolute left-0 top-0 h-5 w-5 border-l-4 border-t-4 border-emerald-400" />
                  <span className="absolute right-0 top-0 h-5 w-5 border-r-4 border-t-4 border-emerald-400" />
                  <span className="absolute bottom-0 left-0 h-5 w-5 border-b-4 border-l-4 border-emerald-400" />
                  <span className="absolute bottom-0 right-0 h-5 w-5 border-b-4 border-r-4 border-emerald-400" />
                </div>
              </div>
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-300">
                  Камера выключена
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Включить камеру
              </button>
              <button
                type="button"
                onClick={() => void stopCamera()}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                disabled={!isCameraOn}
              >
                Остановить
              </button>
              <button
                type="button"
                onClick={resetScan}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Сбросить
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                {errorMessage}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Ввод вручную</p>
          <p className="text-sm text-gray-500">
            Используйте ручной ввод, если сканирование недоступно.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={manualValue}
              onChange={(event) => setManualValue(event.target.value)}
              placeholder="Код партии"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleManualSubmit}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Проверить
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
