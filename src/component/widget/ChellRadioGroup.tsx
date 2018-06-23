import * as React from 'react';
import { CheckboxProps, Form, Radio } from 'semantic-ui-react';
import { IChellWidgetProps } from './ChellWidget';

export interface IChellRadioGroupProps extends IChellWidgetProps {
  id: string;
  options: string[];
  onChange?: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
}

export interface IChellRadioGroupState {
  selectedIndex: number;
}

export default class ChellRadioGroup extends React.Component<IChellRadioGroupProps, IChellRadioGroupState> {
  constructor(props: IChellRadioGroupProps) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  public handleChange = (index: number) => (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    this.setState({
      selectedIndex: index,
    });
    if (this.props.onChange) {
      this.props.onChange(event, data);
    }
  };

  public render() {
    const { id, options } = this.props;
    return (
      <Form>
        <Form.Field>How to calculate distance between two residues:</Form.Field>
        {options.map((option, index) => (
          <Form.Field key={`${id}-${option}`}>
            <Radio
              label={option.toLocaleLowerCase()}
              name={option}
              value={index}
              checked={this.state.selectedIndex === index}
              onChange={this.handleChange(index)}
            />
          </Form.Field>
        ))}
      </Form>
    );
  }
}

export { ChellRadioGroup };
