import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';

export interface ICategorySelectorProps {
  categories: string[];
}

export class CategorySelector extends React.Component<ICategorySelectorProps, any> {
  constructor(props: ICategorySelectorProps) {
    super(props);
  }

  public render() {
    return (
      this.props.categories && (
        <Dropdown
          fluid={true}
          options={this.props.categories.map(cat => {
            return { text: cat, value: cat };
          })}
          placeholder={'Select Category'}
          search={true}
        />
      )
    );
  }
}
