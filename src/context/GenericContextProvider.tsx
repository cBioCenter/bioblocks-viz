// tslint:disable:max-classes-per-file
import * as React from 'react';

export interface IChellContext<R extends object, W extends object, RW = R & W> {
  Consumers: {
    Both: React.Consumer<RW>;
    Read: React.Consumer<R>;
    Write: React.Consumer<W>;
  };
  Providers: {
    Both: React.Provider<RW>;
    Read: React.Provider<R>;
    Write: React.Provider<W>;
  };
  allConsumers: Array<React.Consumer<R> | React.Consumer<W> | React.Consumer<RW>>;
  allProviders: Array<React.Provider<R> | React.Provider<W> | React.Provider<RW>>;
  allProvidersJSX(state: any, children: React.ReactNode): JSX.Element | React.ReactNode;
}

export const createGenericContext = <R extends object, W extends object>(
  readValue: R,
  writeValue: W,
): IChellContext<R, W> => {
  const readContext = React.createContext(readValue);
  const writeContext = React.createContext(writeValue);
  // tslint:disable-next-line:no-object-literal-type-assertion
  const bothContext = React.createContext({ ...(readValue as object), ...(writeValue as object) } as R & W);

  const Consumers = {
    Both: bothContext.Consumer,
    Read: readContext.Consumer,
    Write: writeContext.Consumer,
  };

  const Providers = {
    Both: bothContext.Provider,
    Read: readContext.Provider,
    Write: writeContext.Provider,
  };

  const allConsumers = [...Object.values(Consumers)];
  const allProviders = [...Object.values(Providers)];

  return {
    Consumers,
    Providers,
    allConsumers,
    allProviders,
    allProvidersJSX: (state, children) =>
      allProviders.reduce((prev, Curr) => <Curr value={state}>{prev}</Curr>, children),
  };
};
