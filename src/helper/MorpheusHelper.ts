// tslint:disable-next-line:export-name
export const getMorpheusInstance = async () => {
  // @ts-ignore
  if (!window.$) {
    const jquery = await import('jquery');
    // @ts-ignore
    window.$ = jquery;
  }

  // @ts-ignore
  if (!window._) {
    const lodash = await import('lodash');
    // @ts-ignore
    window._ = lodash;
  }

  return (await import('morpheus-app')).default;
};
