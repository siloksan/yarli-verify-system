import { Link, useParams } from 'react-router';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react';
import {
  SCANNER_ROUTES,
  ScanResult,
  type IOrderComponentDto,
  type IScanEvent,
} from '@repo/api';
import { useOrder } from '~/features/orders/hooks/orders.hook';
import { useNativeFeatures } from '~/shared/hooks';
import { Component } from '~/features/order-recipe/ui/component';
import { STATUS_STYLES } from '~/features/order-recipe/constants';

// type NativeScanResultMessage = {
//   type: 'SCAN_RESULT';
//   payload: {
//     scanResult?: ScanResult;
//     componentId?: string;
//     scannedBatch?: string;
//   };
// };

// type NativeOpenScannerMessage = {
//   type: 'OPEN_SCANNER';
//   payload: ScannerCheckParams & {
//     route: ScannerRoutes;
//   };
// };

// const postMessageToNative = (message: NativeOpenScannerMessage) => {
//   (
//     window as Window & {
//       ReactNativeWebView?: { postMessage: (payload: string) => void };
//     }
//   ).ReactNativeWebView?.postMessage(JSON.stringify(message));
// };

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  console.log('orderId: ', orderId);
  const [pendingScan, setPendingScan] = useState<{
    componentId: string;
    batch?: string;
    result: ScanResult;
  } | null>(null);

  const [latestScanMessage, setLatestScanMessage] = useState<{
    result: ScanResult;
    componentId: string;
    batch?: string;
  } | null>(null);

  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const components: IOrderComponentDto[] = useMemo(
    () =>
      [...(order?.components ?? [])].sort(
        (first, second) => first.position - second.position,
      ),
    [order?.components],
  );

  // const applyScanResult = useCallback(
  //   (componentId: string, scanResult: ScanResult, batch?: string) => {
  //     setPendingScan({
  //       componentId,
  //       batch,
  //       result: scanResult,
  //     });

  //     setLatestScanMessage({
  //       result: scanResult,
  //       componentId,
  //       batch,
  //     });

  //     refetch();
  //   },
  //   [refetch],
  // );

  // useEffect(() => {
  //   const handleNavigation = () => {
  //     const url = new URL(window.location.href);
  //     const scanResultRaw = url.searchParams.get('scanResult');
  //     const componentId = url.searchParams.get('componentId');
  //     const scannedBatch = url.searchParams.get('scannedBatch');
  //     const scanError = url.searchParams.get('scanError');

  //     const scanResult =
  //       scanResultRaw === ScanResult.OK || scanResultRaw === ScanResult.WRONG
  //         ? scanResultRaw
  //         : null;

  //     if (scanResult && componentId) {
  //       const batch = scannedBatch
  //         ? decodeURIComponent(scannedBatch)
  //         : undefined;
  //       applyScanResult(componentId, scanResult, batch);
  //     }

  //     if (scanError && componentId) {
  //       setLatestScanMessage({
  //         result: ScanResult.WRONG,
  //         componentId,
  //       });
  //     }

  //     url.searchParams.delete('scanResult');
  //     url.searchParams.delete('componentId');
  //     url.searchParams.delete('scannedBatch');
  //     url.searchParams.delete('scannedCode');
  //     url.searchParams.delete('scanError');
  //     window.history.replaceState({}, '', url.toString());
  //   };

  //   const handleNativeScanResult = (event: Event) => {
  //     const nativeEvent = event as CustomEvent<NativeScanResultMessage>;
  //     const payload = nativeEvent.detail?.payload;
  //     const scanResult = payload?.scanResult;
  //     const componentId = payload?.componentId;

  //     if (
  //       !componentId ||
  //       !scanResult ||
  //       (scanResult !== ScanResult.OK && scanResult !== ScanResult.WRONG)
  //     ) {
  //       return;
  //     }

  //     applyScanResult(componentId, scanResult, payload?.scannedBatch);
  //   };

  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible') {
  //       handleNavigation();
  //     }
  //   };

  //   const handlePopState = () => {
  //     handleNavigation();
  //   };

  //   handleNavigation();

  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   window.addEventListener('popstate', handlePopState);
  //   window.addEventListener(
  //     'native-scan-result',
  //     handleNativeScanResult as EventListener,
  //   );

  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //     window.removeEventListener('popstate', handlePopState);
  //     window.removeEventListener(
  //       'native-scan-result',
  //       handleNativeScanResult as EventListener,
  //     );
  //   };
  // }, [applyScanResult]);

  // const getStatus = (component: IOrderComponentDto): ComponentStatus => {
  //   // Use optimistic status if available
  //   if (pendingScan?.componentId === component.id) {
  //     return pendingScan.result === ScanResult.OK ? 'ok' : 'wrong';
  //   }

  //   const latestResult = component.scanEvents?.[0]?.result;
  //   if (latestResult === ScanResult.OK) return 'ok';
  //   if (latestResult === ScanResult.WRONG) return 'wrong';
  //   return 'unchecked';
  // };

  // const checkedCount = components.filter(
  //   (component) => getStatus(component) === 'ok',
  // ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 safe-padding">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <Link
            to="/orders"
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-700"
          >
            Назад к заказам
          </Link>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Заказ
              </p>
              <h1 className="text-2xl font-semibold text-gray-900">
                {order?.label ?? 'Рецептура'}
              </h1>
              <p className="text-sm text-gray-500">
                {order?.orderNumber
                  ? `Заказ №${order.orderNumber}`
                  : `ID ${orderId}`}
              </p>
            </div>
            {/* <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Прогресс
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {checkedCount} / {components.length}
              </p>
            </div> */}
          </div>
        </header>

        {latestScanMessage && (
          <section
            className={`rounded-2xl border px-4 py-3 text-sm ${
              latestScanMessage.result === ScanResult.OK
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            <p className="font-semibold">
              {latestScanMessage.result === ScanResult.OK
                ? 'Сканирование успешно'
                : 'Сканирование не прошло проверку'}
            </p>
            {latestScanMessage.batch && (
              <p className="mt-1">Партия: {latestScanMessage.batch}</p>
            )}
          </section>
        )}

        <section className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
          {(['UNCHECKED', 'OK', 'WRONG'] as const).map((status) => (
            <div
              key={status}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[status].dot}`}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Статус
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {STATUS_STYLES[status].label}
                </p>
              </div>
            </div>
          ))}
        </section>

        {isLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Загрузка рецептуры...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не удалось загрузить рецептуру
            {error instanceof Error ? ` ${error.message}` : ''}
          </div>
        )}

        {!isLoading && !isError && components.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            Компоненты для этого заказа не найдены.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {components.map((component) => {
            const {
              orderId,
              componentName,
              id: componentId,
              validBatches,
            } = component;
            // const status = getStatus(component);
            // const style = statusStyles[status];
            const batches = component.validBatches ?? [];
            const previewBatches = batches.slice(0, 3);
            const remainingCount = batches.length - previewBatches.length;
            const isPending = pendingScan?.componentId === component.id;
            const scannedBatchesFromEvents = Array.from(
              new Set(
                (component.scanEvents ?? [])
                  .map((event) => event.scannedComponentBatch)
                  .filter((batch): batch is string => Boolean(batch)),
              ),
            );
            const scannedBatches = Array.from(
              new Set(
                isPending && pendingScan?.batch
                  ? [pendingScan.batch, ...scannedBatchesFromEvents]
                  : scannedBatchesFromEvents,
              ),
            );

            // const checkScannerPayload = generateScannerPayload(
            //   orderId,
            //   componentId,
            //   componentName,
            //   SCANNER_ROUTES.scanner_check,
            //   validBatches,
            // );
            // const checkScannerLink = generateDeepLink(checkScannerPayload);

            // const checkAndFillScannerPayload = generateScannerPayload(
            //   orderId,
            //   componentId,
            //   componentName,
            //   SCANNER_ROUTES.scanner_check_and_fill,
            //   validBatches,
            // );
            // const checkAndFillScannerLink = generateDeepLink(
            //   checkAndFillScannerPayload,
            // );

            // const handleScannerPress = (
            //   event: MouseEvent<HTMLAnchorElement>,
            //   scannerPayload: NativeOpenScannerMessage['payload'],
            // ) => {
            //   // Store that we're navigating to scanner
            //   sessionStorage.setItem('scanning_component', component.id);

            //   if (!isRunningInNativeWebView()) {
            //     return;
            //   }

            //   event.preventDefault();
            //   postMessageToNative({
            //     type: 'OPEN_SCANNER',
            //     payload: scannerPayload,
            //   });
            // };

            return (
              <Component
                key={componentId}
                orderId={orderId}
                componentId={componentId}
                componentName={componentName}
                requiredQty={component.requiredQty}
                unit={component.unit}
                status={'UNCHECKED'}
                validBatches={batches}
                scanEvents={component.scanEvents ?? []}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// const generateScannerPayload = (
//   orderId: string,
//   componentId: string,
//   componentName: string,
//   scanRoutes: ScannerRoutes,
//   validBatches: string[] = [],
// ) => ({
//   orderId,
//   componentId,
//   componentName,
//   validBatches,
//   callback: `${window.location.origin}/orders/${orderId}`,
//   route: scanRoutes,
// });

// const generateDeepLink = (
//   scannerPayload: NativeOpenScannerMessage['payload'],
// ) => {
//   const rawParams: Omit<ScannerCheckParams, 'validBatches'> = {
//     orderId: scannerPayload.orderId,
//     componentId: scannerPayload.componentId,
//     componentName: scannerPayload.componentName,
//     callback: scannerPayload.callback,
//   };

//   const params = new URLSearchParams(rawParams);

//   if ((scannerPayload.validBatches ?? []).length > 0) {
//     params.set('validBatches', JSON.stringify(scannerPayload.validBatches));
//   }

//   return `scanner:///${scannerPayload.route}?${params.toString()}`;
// };
