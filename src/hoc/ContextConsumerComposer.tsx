import * as React from 'react';

/**
 * ContextConsumerComposer is meant to streamline connecting various context consumers.
 * Heavily based off of [react-composer](https://github.com/jamesplease/react-composer).
 *
 * However, this only accepts an array of context types instead.
 */
export interface IComposerProps {
  components: Array<React.ComponentType<any>>;
  children(args: any[]): JSX.Element;
}

class ContextConsumerComposer extends React.Component<IComposerProps, any> {
  public render() {
    const { children, components } = this.props;

    return renderRecursive(children, components);
  }
}

/**
 * Recursively build up elements from props.components and accumulate `results` along the way.
 */
const renderRecursive = (
  render: (args: any) => React.ReactElement<any>,
  remaining: Array<React.ComponentType<any>>,
  results: Array<React.ReactElement<any>> = [],
): React.ReactElement<any> => {
  // Once components is exhausted, we can render out the results array.
  if (!remaining[0]) {
    return render(results);
  }

  // Continue recursion for remaining items.
  // results.concat([value]) ensures [...results, value] instead of [...results, ...value]
  function nextRender(value: any) {
    return renderRecursive(render, remaining.slice(1), results.concat([value]));
  }

  const Item = remaining[0];

  // When it is an element, enhance the element's props with the render prop.
  return React.cloneElement(<Item>{nextRender}</Item>, { displayName: Item.displayName });
};

export { ContextConsumerComposer };
