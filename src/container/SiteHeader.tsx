import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
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

export interface ISiteHeaderProps extends Partial<RouteComponentProps> {
  numDatasets: number;
}

export interface ISiteHeaderState {
  currentPageName: null | string;
  isModalOpen: boolean;
}

export class SiteHeader extends React.Component<ISiteHeaderProps, ISiteHeaderState> {
  public static defaultProps = {
    numDatasets: 0,
  };

  constructor(props: ISiteHeaderProps) {
    super(props);
    this.state = {
      currentPageName: null,
      isModalOpen: false,
    };
  }

  public componentDidMount() {
    window.addEventListener('click', this.onMouseClick);
    if (this.props.location) {
      this.handleQueryParams(this.props.location.search);
    }
  }

  public componentDidUpdate(prevProps: ISiteHeaderProps) {
    if (this.props.location && this.props.location !== prevProps.location) {
      this.handleQueryParams(this.props.location.search);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('click', this.onMouseClick);
  }

  public render() {
    return (
      <Header>
        <Menu secondary={true} borderless={true} fluid={true} style={{ maxHeight: '40px', padding: '20px 0 0 0' }}>
          <Menu.Item fitted={'vertically'} position={'left'}>
            <Link to={'/'}>
              <img
                alt={'hca-dynamics-icon'}
                src={'assets/icons/bio-blocks-icon-2x.png'}
                style={{ height: '32px', width: '32px' }}
              />
              <span style={{ color: 'black', fontSize: '32px', fontWeight: 'bold' }}>HCA Dynamics</span>
            </Link>
          </Menu.Item>
          {this.renderNavMenu()}
          <Menu.Item position={'right'}>
            <Input icon={'search'} size={'massive'} transparent={true} />
          </Menu.Item>
        </Menu>
        {this.renderNavBreadcrumb()}
      </Header>
    );
  }

  protected renderNavBreadcrumb() {
    return (
      <Breadcrumb style={{ padding: '0 0 0 40px' }}>
        <Breadcrumb.Section>
          <Link to={'/'}>home</Link>
        </Breadcrumb.Section>
        {this.props.location &&
          this.props.location.pathname
            .split('/')
            .filter(candidatePath => candidatePath.length >= 1)
            .map((path, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                <Breadcrumb.Divider icon={'right angle'} />
                <Breadcrumb.Section>
                  <Link to={`/${path}`}>{path}</Link>
                </Breadcrumb.Section>
              </React.Fragment>
            ))}
        {this.state.currentPageName && (
          <>
            <Breadcrumb.Divider icon={'right angle'} />
            <Breadcrumb.Section>{this.state.currentPageName}</Breadcrumb.Section>
          </>
        )}
      </Breadcrumb>
    );
  }

  protected renderNavMenu = () => {
    return (
      <Menu defaultActiveIndex={-1} secondary={true}>
        <Menu.Item key={'datasets'} onClick={this.openModal} style={{ color: 'black', fontSize: '18px' }}>
          datasets
          <Modal open={this.state.isModalOpen} onClose={this.closeModal}>
            <Modal.Content> {this.renderDatasetMenu()}</Modal.Content>
          </Modal>
        </Menu.Item>
        <Menu.Item key={'visualizations'}>
          <Link to={'/visualizations'} style={{ color: 'black', fontSize: '18px' }}>
            visualizations
          </Link>
        </Menu.Item>
        <Menu.Item key={'stories'}>
          <Link to={'/stories'} style={{ color: 'black', fontSize: '18px' }}>
            stories
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  protected handleQueryParams(search: string) {
    const params = new URLSearchParams(search);
    const visualizations = params.getAll('viz');
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const name = params.get('name');

    if (visualizations.length >= 1 && !name) {
      this.setState({
        currentPageName: name,
        isModalOpen: true,
      });
    } else {
      this.setState({
        currentPageName: name,
        isModalOpen: false,
      });
    }
  }

  protected onMouseClick = (e: MouseEvent) => {
    return;
  };

  protected renderVisualizationsMenu = () => {
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
                { key: 'Author', content: 'Weinreb, Wolock, Klein' },
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
    let visualizations: string[] = [];
    if (this.props.location) {
      const params = new URLSearchParams(this.props.location.search);
      visualizations = params.getAll('viz').map(viz => `viz=${viz}`);
    }

    const datasets = [
      'hpc/full',
      'hpc_sf2/full',
      'tabula_muris/10k',
      'tabula_muris/full',
      'tabula_muris/lung',
      'tabula_muris/trachea',
    ];

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
          <List>{datasets.map((dataset, index) => this.renderDatasetLinkItem(dataset, index, visualizations))}</List>
        ),
      },
      {
        menuItem: 'upload from computer',
        render: () => <Tab.Pane>Coming soon!</Tab.Pane>,
      },
    ];

    return (
      <Container fluid={true}>
        <Header>datasets</Header>
        <Divider />
        <Tab defaultActiveIndex={1} menu={{ secondary: true, pointing: true }} panes={panes} />
      </Container>
    );
  };

  protected renderDatasetLinkItem = (datasetName: string, index: number, visualizations: string[]) => (
    <List.Item key={`dataset-link-${index}`}>
      <Link
        onClick={this.closeModal}
        to={{ pathname: '/dataset', search: `?name=${datasetName}&${visualizations.join('&')}` }}
      >
        {datasetName}
      </Link>
    </List.Item>
  );

  protected closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  protected openModal = (event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
    this.setState({ isModalOpen: true });
  };
}
