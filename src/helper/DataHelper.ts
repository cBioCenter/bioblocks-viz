import * as d3 from 'd3';
import * as NGL from 'ngl';
import { ISpringCategoricalColorData, ISpringCategoricalColorDataInput, ISpringGraphData } from 'spring';
import { CONTACT_MAP_DATA_TYPE, IContactMapData, ICouplingScore, IMonomerContact, VIZ_TYPE } from '../data/chell-data';

export const fetchAppropriateData = async (viz: VIZ_TYPE, dataDir: string) => {
  switch (viz) {
    case VIZ_TYPE['T-SNE']:
      return fetchTSneCoordinateData(dataDir);
    case VIZ_TYPE.SPRING:
      return deriveSpringData(dataDir);
    case VIZ_TYPE.NGL:
      return fetchNGLData(dataDir);
    case VIZ_TYPE.CONTACT_MAP:
      return fetchContactMapData(dataDir);
    default:
      return Promise.reject({ error: `Currently no appropriate data getter for ${viz}` });
  }
};

const deriveSpringData = async (dataDir: string) => {
  const coordinates = await fetchSpringCoordinateData(`${dataDir}/coordinates.txt`);
  const graphData = await fetchGraphData(`${dataDir}/graph_data.json`);
  // const colorData = await this.fetchColorData(`${this.props.dataDir}/color_data_gene_sets.csv`);
  const catColorData = await fetchCategoricalColorData(`${dataDir}/categorical_coloring_data.json`);

  const nodeDict: any = {};

  for (let i = 0; i < graphData.nodes.length; ++i) {
    const node = graphData.nodes[i];
    nodeDict[node.number] = node;
    if (node.number in coordinates) {
      node.fixed = true;
      node.x = coordinates[node.number][0];
      node.y = coordinates[node.number][1];
    }
    const label = catColorData.label_list[i];
    node.category = label;
    node.colorHex = catColorData.label_colors[label];
  }

  graphData.links.forEach(link => {
    const source = nodeDict[link.source as string];
    const target = nodeDict[link.target as string];
    if (source && target) {
      link.source = source;
      link.target = target;
    }
  });

  return graphData;
};

const fetchCategoricalColorData = async (file: string): Promise<ISpringCategoricalColorData> => {
  const input = (await d3.json(file)) as ISpringCategoricalColorDataInput;
  const output: ISpringCategoricalColorData = {
    label_colors: {},
    label_list: input[Object.keys(input)[0]].label_list,
  };

  const { label_colors } = input[Object.keys(input)[0]];

  // The input file might specify hex values as either 0xrrggbb or #rrggbb, so we might need to convert the input to a consistent output format.
  for (const key of Object.keys(label_colors)) {
    const hex = label_colors[key];
    if (typeof hex === 'number') {
      output.label_colors[key] = hex;
    } else if (hex.charAt(0) === '#') {
      output.label_colors[key] = Number.parseInt('0x' + hex.slice(1));
    } else {
      output.label_colors[key] = Number.parseInt(hex);
    }
  }
  return output;
};

export const fetchColorData = async (file: string) => {
  const colorText: string = await d3.text(file);
  const dict: { [k: string]: any } = {};
  colorText.split('\n').forEach((entry, index, array) => {
    if (entry.length > 0) {
      const items = entry.split(',');
      const gene = items[0];
      const expArray: any[] = [];
      items.forEach((e, i, a) => {
        if (i > 0) {
          expArray.push(parseFloat(e));
        }
      });
      dict[gene] = expArray;
    }
  });
  return dict;
};

const fetchSpringCoordinateData = async (file: string) => {
  const coordinateText: string = await d3.text(file);

  const coordinates: number[][] = [];
  coordinateText!.split('\n').forEach((entry, index, array) => {
    const items = entry.split(',');
    if (items.length >= 3) {
      const xx = parseFloat(items[1].trim());
      const yy = parseFloat(items[2].trim());
      const nn = parseInt(items[0].trim(), 10);
      coordinates[nn] = [xx, yy];
    }
  });
  return coordinates;
};

const fetchTSneCoordinateData = async (dataDir: string) => {
  const colorText: string = await d3.text(`${dataDir}/tsne_output.csv`);
  const result: number[][] = [];
  colorText.split('\n').forEach((entry, index, array) => {
    if (entry.length > 0) {
      const items = entry.split(',');
      const coordinates = [parseFloat(items[0]), parseFloat(items[1])];
      result.push(coordinates);
    }
  });
  return result;
};

const fetchGraphData = async (file: string) => {
  const data = (await d3.json(file)) as ISpringGraphData;
  if (!data.nodes || !data.links) {
    throw new Error('Unable to parse graph_data - does it have node key(s)?');
  }
  return data;
};

const fetchNGLData = async (dir: string) => {
  const file = `${dir}/protein.pdb`;
  const data = await NGL.autoLoad(file);
  return data as NGL.Structure;
};

const fetchContactMapData = async (dir: string): Promise<IContactMapData> => {
  const contactMapFiles = ['contacts_monomer.csv', 'coupling_scores.csv' /*, 'distance_map.csv'*/];
  const promiseResults = await Promise.all(contactMapFiles.map(file => d3.text(`${dir}/${file}`)));

  const data: CONTACT_MAP_DATA_TYPE = {
    contactMonomer: getContactMonomerData(promiseResults[0]),
    couplingScore: getCouplingScoresData(promiseResults[1]),
    // distanceMapMonomer: parseDistanceMonomerLine(promiseResults[2]),
  };

  return data;
};

export const getContactMonomerData = (line: string): IMonomerContact[] => {
  const results: IMonomerContact[] = [];
  line
    .split('\n')
    .slice(1)
    .forEach(row => {
      const items = row.split(',');
      if (items.length === 3) {
        results.push({ i: parseFloat(items[0]), j: parseFloat(items[1]), dist: parseFloat(items[2]) });
      }
    });
  return results;
};

export const getCouplingScoresData = (line: string): ICouplingScore[] =>
  line
    .split('\n')
    .slice(1)
    .map(row => {
      const items = row.split(',');
      return {
        i: parseFloat(items[0]),
        // tslint:disable-next-line:object-literal-sort-keys
        A_i: items[1],
        j: parseFloat(items[2]),
        A_j: items[3],
        fn: parseFloat(items[4]),
        cn: parseFloat(items[5]),
        segment_i: items[6],
        segment_j: items[7],
        probability: parseFloat(items[8]),
        dist_intra: parseFloat(items[9]),
        dist_multimer: parseFloat(items[10]),
        dist: parseFloat(items[11]),
        precision: parseFloat(items[12]),
      };
    });
