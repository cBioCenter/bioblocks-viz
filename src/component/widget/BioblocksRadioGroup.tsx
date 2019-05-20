import * as React from 'react';
import { CheckboxProps, Form, Grid } from 'semantic-ui-react';

export interface IBioblocksRadioGroupProps {
  defaultOption?: string;
  disabled: boolean;
  id: string;
  options: string[];
  style: React.CSSProperties;
  title: string;
  onChange?(value: any): void;
}

export interface IBioblocksRadioGroupState {
  selectedIndex: number;
}

export class BioblocksRadioGroup extends React.Component<IBioblocksRadioGroupProps, IBioblocksRadioGroupState> {
  public static defaultProps = {
    disabled: false,
    style: {},
    title: 'How to calculate distance between two residues:',
  };

  constructor(props: IBioblocksRadioGroupProps) {
    super(props);
    const { defaultOption, options } = props;
    this.state = {
      selectedIndex: defaultOption && options.includes(defaultOption) ? options.indexOf(defaultOption) : 0,
    };
  }

  public handleChange = (index: number) => (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    const { onChange } = this.props;
    this.setState({
      selectedIndex: index,
    });

    if (onChange) {
      onChange(index);
    }
  };

  public render() {
    const { disabled, id, options, style, title } = this.props;

    return (
      <div style={style}>
        <Grid centered={true} columns={2} padded={true}>
          <Grid.Row>
            <div style={{ fontStyle: 'italic', fontWeight: 'bold', textDecoration: 'underline' }}>{title}</div>
          </Grid.Row>
          {options.map((option, index) => (
            <Grid.Column key={`${id}-${option}`} style={{ paddingBottom: 0, paddingTop: '7px' }}>
              <Form.Radio
                checked={this.state.selectedIndex === index}
                disabled={disabled}
                label={{ children: option, style }}
                name={option}
                onChange={this.handleChange(index)}
                value={index}
              />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    );
  }
}
