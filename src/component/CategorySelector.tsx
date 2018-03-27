import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';

export interface ICategorySelectorProps {
  categories: string[];
  onCategoryChange?: (event: React.SyntheticEvent<any>, data: object) => void;
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
          onChange={this.props.onCategoryChange}
          options={[
            { text: 'all', value: undefined },
            ...this.props.categories.map(cat => {
              return { text: cat, value: cat };
            }),
          ]}
          placeholder={'Select Category'}
          search={true}
        />
      )
    );
  }
}
