import * as React from 'react';
import { CheckboxProps, Form, Radio } from 'semantic-ui-react';
import { IChellWidgetProps } from './ChellWidget';

export interface IChellRadioGroupProps extends IChellWidgetProps {
  id: string;
  options: string[];
  onChange?: (value: any) => void;
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
      this.props.onChange(index);
    }
  };

  public render() {
    const { id, options } = this.props;
    return (
      <Form>
        <Form.Field>How to calculate distance between two residues:</Form.Field>
        {this.renderOptions(id, options)}
      </Form>
    );
  }

  protected renderOptions = (id: string, options: string[]) =>
    options.map((option, index) => (
      <Form.Field key={`${id}-${option}`}>
        <Radio
          label={option.toLocaleLowerCase()}
          name={option}
          value={index}
          checked={this.state.selectedIndex === index}
          onChange={this.handleChange(index)}
        />
      </Form.Field>
    ));
}

export { ChellRadioGroup };
