export const PLATFORM_KEY = 'platform';
export const PLATFORM_VALUES = {
    APP: 'app',
    BROWSER: 'browser',
};
export function createWebPathToMobileApp(originalPath) {
    return `${originalPath}?${PLATFORM_KEY}=${PLATFORM_VALUES.APP}`;
}
//# sourceMappingURL=platform.helper.js.map