import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Await the locale from the request
  let locale = await requestLocale;

   // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;

    return {
      messages,
      locale,
    };
  } catch (error) {
    notFound(); // Gracefully handle missing translation files
  }
});

// export default getRequestConfig(async ({locale}) => {
//   // Validate that the incoming `locale` parameter is valid
//   if (!routing.locales.includes(locale as any)) notFound();
//
//   return {
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });