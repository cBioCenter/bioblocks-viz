import * as React from 'react';
import { CheckboxProps, Form } from 'semantic-ui-react';

export interface IChellRadioGroupProps {
  disabled: boolean;
  id: string;
  options: string[];
  style: React.CSSProperties;
  title: string;
  onChange?(value: any): void;
}

export interface IChellRadioGroupState {
  selectedIndex: number;
}

export class ChellRadioGroup extends React.Component<IChellRadioGroupProps, IChellRadioGroupState> {
  public static defaultProps = {
    disabled: false,
    style: {},
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
    const { disabled, id, options, style, title } = this.props;
    return (
      <Form style={style}>
        <Form.Field>{title}</Form.Field>
        <Form.Group widths={'equal'}>{this.renderOptions(id, options, disabled, style)}</Form.Group>
      </Form>
    );
  }

  protected renderOptions = (id: string, options: string[], disabled: boolean, style: React.CSSProperties) =>
    options.map((option, index) => (
      <Form.Radio
        checked={this.state.selectedIndex === index}
        disabled={disabled}
        key={`${id}-${option}`}
        label={{ children: option.toLocaleLowerCase(), style }}
        name={option}
        onChange={this.handleChange(index)}
        value={index}
      />
    ));
}
