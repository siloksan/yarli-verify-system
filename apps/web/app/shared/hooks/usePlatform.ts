import { PLATFORM_KEY, PLATFORM_VALUES } from '@repo/api';
import { useSearchParams } from 'react-router';

interface InternalLinks {
  appUrl: string;
  webUrl: string;
}

export function usePlatform() {
  const [searchParams] = useSearchParams();

  const isApp = searchParams.get(PLATFORM_KEY) === PLATFORM_VALUES.APP;

  const getUrl = ({ appUrl, webUrl }: InternalLinks) => {
    return isApp ? appUrl : webUrl;
  };

  return { getUrl, isApp };
}
