import { PLATFORM_KEY, PLATFORM_VALUES } from '@repo/api';
import { useSearchParams } from 'react-router';

interface InternalLinks {
  appUrl: string;
  webUrl: string;
}

export function usePlatform() {
  const [searchParams] = useSearchParams();

  const platform =
    searchParams.get(PLATFORM_KEY) === PLATFORM_VALUES.APP
      ? PLATFORM_VALUES.APP
      : PLATFORM_VALUES.BROWSER;

  const getUrl = ({ appUrl, webUrl }: InternalLinks) => {
    return platform === PLATFORM_VALUES.APP ? appUrl : webUrl;
  };

  return { getUrl, platform };
}
