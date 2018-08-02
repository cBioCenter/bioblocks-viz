import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';

export interface ICategorySelectorProps {
  /** Categories to select from. */
  categories: string[];
  /** Callback for when a new category is selected. */
  onCategoryChange?: (event: React.SyntheticEvent<any>, data: object) => void;
}

/**
 * Class to represent a dropdown.
 *
 * @extends {React.Component<ICategorySelectorProps, any>}
 */
export default class CategorySelector extends React.Component<ICategorySelectorProps, any> {
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
            { key: 'all', text: 'all', value: undefined },
            ...this.props.categories.map(cat => {
              return { key: cat, text: cat, value: cat };
            }),
          ]}
          placeholder={'Select Category'}
          search={true}
        />
      )
    );
  }
}

export { CategorySelector };
