import { mount } from 'enzyme';
import * as React from 'react';

import { createGenericContext } from '~chell-viz~/context';

describe('Generic Context Provider', () => {
  it('Should render read, write, and both providers at once.', () => {
    const readContext = {
      name: 'Lucas',
    };
    const writeContext = {
      updateName: () => {
        return;
      },
    };

    const context = createGenericContext(readContext, writeContext);

    expect(context.allProvidersJSX(readContext, <></>)).toMatchSnapshot();
  });

  it('Should allow updates.', () => {
    const initialReadValue = {
      name: 'Lucas',
    };
    const initialWriteValue = {
      updateName: (name: string) => {
        return;
      },
    };

    const SmashContext = createGenericContext(initialReadValue, initialWriteValue);

    class MockContextProvider extends React.Component<any, typeof initialWriteValue & typeof initialReadValue> {
      constructor(props: any) {
        super(props);
        this.state = {
          name: 'Lucas',
          updateName: this.onUpdateName,
        };
      }

      public render() {
        return SmashContext.allProvidersJSX(this.state, this.props.children);
      }

      public onUpdateName = (name: string) => {
        this.setState({
          name,
        });
      };
    }

    // tslint:disable-next-line:max-classes-per-file
    class MockContextConsumer extends React.Component<any, any> {
      constructor(props: any) {
        super(props);
      }

      public render() {
        return (
          <SmashContext.Consumers.Read>
            {context => <div>{`Hi! My name is ${context.name}`}</div>}
          </SmashContext.Consumers.Read>
        );
      }
    }

    const wrapper = mount(
      <MockContextProvider>
        <MockContextConsumer />
      </MockContextProvider>,
    );

    expect(wrapper).toMatchSnapshot();

    (wrapper.instance() as MockContextProvider).onUpdateName('Isaac');

    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
