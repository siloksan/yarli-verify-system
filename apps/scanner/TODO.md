# QR/Barcode Scanner App TODO

## 1. Project Setup

- [ ] Create Expo app (already done)
- [ ] Install dependencies: `expo-camera`, `expo-barcode-scanner`
- [ ] Install deep linking support: `expo-linking`

## 2. Configure Deep Linking

- [ ] Add custom scheme in `app.json` (`scannerapp://`)
- [ ] Define deep link for opening scanner with `componentId`
- [ ] Define return URL to web with scan results

## 3. Implement Scanner Screen

- [ ] Request camera permissions
- [ ] Add `BarCodeScanner` component
- [ ] Handle barcode/QR scanned event
- [ ] Redirect back to web with scan data
- [ ] Add "Scan again" button for retries

## 4. Handle Deep Linking in App

- [ ] Configure linking in `NavigationContainer`
- [ ] Pass `componentId` from deep link to scanner screen
- [ ] Ensure app opens correctly from both cold and warm start

## 5. UX Enhancements

- [ ] Vibrate or beep on successful scan
- [ ] Show overlay / instructions
- [ ] Auto-close scanner after scan
- [ ] Handle screen orientation if needed

## 6. Testing

- [ ] Test deep link opening on device
- [ ] Test returning scanned data to web
- [ ] Test permission denied flow
- [ ] Test scan failure / retry

## 7. Production Considerations

- [ ] Keep app lightweight (single screen, camera only)
- [ ] Handle errors gracefully
- [ ] Preinstall on worker devices
- [ ] Ensure reliable deep link flow
