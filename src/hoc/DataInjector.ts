/*
import * as React from 'react';

export const hasMockData = (mockData, delay) => wrappedComponent: React.Component => {
  class HasMockData extends React.Component {
    state = {
      data: [],
      useDefault: true
    }

    componentDidMount() {
      this.props.addTimeout(() => this.setState({data: mockData}), delay)
    }

    componentWillUnmount() {
      this.props.clearTimeouts()
    }

    render() {
      return <WrappedComponent data={this.state.data} {...this.props} />
    }
  }

  return hasTimeouts(HasMockData)
}
*/
