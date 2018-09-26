import * as React from 'react';
import { CheckboxProps, Form, Radio } from 'semantic-ui-react';
import { IChellWidgetProps } from './ChellWidget';

export interface IChellRadioGroupProps extends IChellWidgetProps {
  disabled: boolean;
  id: string;
  options: string[];
  onChange?: (value: any) => void;
  title: string;
}

export interface IChellRadioGroupState {
  selectedIndex: number;
}

export default class ChellRadioGroup extends React.Component<IChellRadioGroupProps, IChellRadioGroupState> {
  public static defaultProps: Partial<IChellRadioGroupProps> = {
    disabled: false,
    title: 'How to calculate distance between two residues:',
  };

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
    const { disabled, id, options, title } = this.props;
    return (
      <Form>
        <Form.Field>{title}</Form.Field>
        {this.renderOptions(id, options, disabled)}
      </Form>
    );
  }

  protected renderOptions = (id: string, options: string[], disabled: boolean) =>
    options.map((option, index) => (
      <Form.Field key={`${id}-${option}`}>
        <Radio
          disabled={disabled}
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
