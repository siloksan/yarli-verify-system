export function isAndroidChrome() {
  const ua = navigator.userAgent.toLowerCase();

  const isAndroid = ua.includes('android');
  const isChrome =
    ua.includes('chrome') &&
    !ua.includes('samsungbrowser') &&
    !ua.includes('yabrowser') &&
    !ua.includes('opr');

  return isAndroid && isChrome;
}
