import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Checkbox,
  Container,
  Divider,
  Dropdown,
  Header,
  Input,
  List,
  Menu,
  MenuItemProps,
  Modal,
  Search,
  Tab,
  Table,
} from 'semantic-ui-react';

export interface ISiteHeaderProps {
  numDatasets: number;
  numVisualizations: number;
}

export interface ISiteHeaderState {
  activeTabIndex: number | string;
  isModalOpen: boolean;
}

export class SiteHeaderClass extends React.Component<ISiteHeaderProps, ISiteHeaderState> {
  public static defaultProps = {
    numDatasets: 0,
  };

  constructor(props: ISiteHeaderProps) {
    super(props);
    this.state = {
      activeTabIndex: -1,
      isModalOpen: false,
    };
  }

  public componentDidMount() {
    window.addEventListener('click', this.onMouseClick);
  }

  public componentWillUnmount() {
    window.removeEventListener('click', this.onMouseClick);
  }

  public render() {
    return (
      <Menu secondary={true} borderless={true} fluid={true} style={{ maxHeight: '40px' }}>
        <Menu.Item fitted={'vertically'} position={'left'}>
          <img
            alt={'hca-dynamics-icon'}
            src={'assets/bio-blocks-icon-2x.png'}
            style={{ height: '32px', width: '32px' }}
          />
          <span style={{ fontSize: '32px', fontWeight: 'bold' }}>HCA Dynamics</span>
        </Menu.Item>
        {this.renderTabMenu()}
        <Menu.Item position={'right'}>
          <Input icon={'search'} size={'massive'} transparent={true} />
        </Menu.Item>
      </Menu>
    );
  }

  protected renderTabMenu = () => {
    const panes = [
      {
        menuItem: (
          <Menu.Item onClick={this.openModal}>{`dataset ${
            this.props.numDatasets >= 1 ? `(${this.props.numDatasets})` : ''
          }`}</Menu.Item>
        ),
        render: () => (
          <Modal open={this.state.isModalOpen} onClose={this.closeModal}>
            <Modal.Content> {this.renderDatasetMenu()}</Modal.Content>
          </Modal>
        ),
      },
      {
        menuItem: <Menu.Item onClick={this.openModal}>{`apps (${this.props.numVisualizations})`}</Menu.Item>,
        render: () => (
          <Modal open={this.state.isModalOpen} onClose={this.closeModal}>
            <Modal.Content>{this.renderAppsMenu()}</Modal.Content>
          </Modal>
        ),
      },
    ];

    return <Tab defaultActiveIndex={-1} menu={{ secondary: true }} renderActiveOnly={true} panes={panes} />;
  };

  protected onMouseClick = (e: MouseEvent) => {
    return;
  };

  protected onTabChange = (event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
    this.setState({
      activeTabIndex: data.index !== undefined && this.state.activeTabIndex !== data.index ? data.index : -1,
    });
  };

  protected renderAppsMenu = () => {
    return (
      <Container fluid={true}>
        <Header>Visualization applications</Header>
        <Divider />
        dataset
        <Divider />
        <Search defaultValue={'search'} icon={false} />
        <Table basic={'very'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Select</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Author(s)</Table.HeaderCell>
              <Table.HeaderCell>Last updated</Table.HeaderCell>
            </Table.Row>

            <Table.Row
              cells={[
                { key: 'Select', content: <Checkbox checked={true} /> },
                { key: 'Name', content: 'SPRING' },
                { key: 'Author', content: 'Weinreb, Wollock, Klein' },
                { key: 'Last Updated', content: 'Nov 13, 2018' },
              ]}
            />
            <Table.Row
              cells={[
                { key: 'Select', content: <Checkbox checked={false} /> },
                { key: 'Name', content: 'tSNE-Tensor' },
                { key: 'Author', content: '??' },
                { key: 'Last Updated', content: 'Nov 13, 2018' },
              ]}
              style={{ border: 'none' }}
            />
            <Table.Row
              cells={[
                { key: 'Select', content: <Checkbox checked={false} /> },
                { key: 'Name', content: 'Anatomogram' },
                { key: 'Author', content: '??' },
                { key: 'Last Updated', content: 'Nov 13, 2018' },
              ]}
              style={{ border: 'none' }}
            />
          </Table.Header>
        </Table>
      </Container>
    );
  };

  protected renderDatasetMenu = () => {
    const panes = [
      {
        menuItem: 'human cell atlas',
        render: () => (
          <Tab.Pane>
            <Container fluid={true}>
              <Table basic={'very'}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Dropdown placeholder={'search'} selection={true} />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Dropdown placeholder={'organ'} selection={true} />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Dropdown placeholder={'method'} selection={true} />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Dropdown placeholder={'donor'} selection={true} />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Dropdown placeholder={'specimen'} selection={true} />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
              </Table>
            </Container>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'HCA Dynamics public',
        render: () => (
          <List>
            <List.Item>
              <Link onClick={this.closeModal} to={{ pathname: '/dataset', search: '?name=hpc/full' }}>
                HPC (full)
              </Link>
            </List.Item>
            <List.Item>
              <Link onClick={this.closeModal} to={{ pathname: '/dataset', search: '?name=tabula_muris/full' }}>
                Tabula Muris (full)
              </Link>
            </List.Item>
          </List>
        ),
      },
      {
        menuItem: 'upload from computer',
        render: () => <Tab.Pane>Coming soon!</Tab.Pane>,
      },
    ];

    return (
      <Container fluid={true}>
        <Header>SPRING datasets</Header>
        <Divider />
        <Tab defaultActiveIndex={1} menu={{ secondary: true, pointing: true }} panes={panes} />
      </Container>
    );
  };

  protected closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  protected openModal = () => {
    this.setState({ isModalOpen: true });
  };
}

type requiredProps = Omit<ISiteHeaderProps, keyof typeof SiteHeaderClass.defaultProps> & Partial<ISiteHeaderProps>;

const SiteHeader = withRouter<requiredProps & RouteComponentProps>(SiteHeaderClass as any);

export { SiteHeader };
