import { ISecondaryStructureData, SECONDARY_STRUCTURE_CODES } from '../data/chell-data';
import { CouplingContainer } from '../data/CouplingContainer';
import { fetchCSVFile, fetchJSONFile } from './FetchHelper';

import * as NGL from 'ngl';

import { ISpringCategoricalColorData, ISpringCategoricalColorDataInput, ISpringGraphData } from 'spring';
import { CONTACT_MAP_DATA_TYPE, IContactMapData, VIZ_TYPE } from '../data/chell-data';
import { ChellPDB } from '../data/ChellPDB';

export const fetchAppropriateData = async (viz: VIZ_TYPE, dataDir: string) => {
  switch (viz) {
    case VIZ_TYPE['T-SNE']:
      return fetchTSneCoordinateData(dataDir);
    case VIZ_TYPE.SPRING:
      return deriveSpringData(dataDir);
    case VIZ_TYPE.NGL:
      return fetchNGLDataFromDirectory(dataDir);
    case VIZ_TYPE.CONTACT_MAP:
    case VIZ_TYPE.INFO_PANEL:
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
  const input = (await fetchJSONFile(file)) as ISpringCategoricalColorDataInput;
  const firstKey = Object.keys(input)[0];
  const firstColorData = input[firstKey];
  if (!firstColorData.label_colors || !firstColorData.label_list) {
    throw new Error("Unable to parse color data - does it have keys named 'label_colors' and 'label_list'");
  }
  const output: ISpringCategoricalColorData = {
    label_colors: {},
    label_list: firstColorData.label_list,
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

const fetchSpringCoordinateData = async (file: string) => {
  const coordinateText: string = await fetchCSVFile(file);

  const coordinates: number[][] = [];
  const rows = coordinateText!.split('\n');
  rows.forEach((entry, index, array) => {
    const items = entry.split(',');
    if (items.length >= 3) {
      const xx = parseFloat(items[1].trim());
      const yy = parseFloat(items[2].trim());
      const nn = parseInt(items[0].trim(), 10);
      coordinates[nn] = [xx, yy];
    } else if (entry.localeCompare('') !== 0) {
      throw new Error(`Unable to parse coordinate data - Row ${index} does not have at least 3 columns!`);
    }
  });
  return coordinates;
};

const fetchTSneCoordinateData = async (dataDir: string) => {
  const colorText: string = await fetchCSVFile(`${dataDir}/tsne_output.csv`);
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
  const data = (await fetchJSONFile(file)) as ISpringGraphData;
  if (!data.nodes || !data.links) {
    throw new Error("Unable to parse graph data - does it have keys named 'nodes' and 'links'");
  }
  return data;
};

export const fetchNGLDataFromDirectory = async (dir: string) => {
  if (dir.length === 0) {
    return Promise.reject('Empty path.');
  }
  const file = `${dir}/protein.pdb`;
  return fetchNGLDataFromFile(file);
};

export const fetchNGLDataFromFile = async (file: string) => (await NGL.autoLoad(file)) as NGL.Structure;

export const fetchContactMapData = async (dir: string): Promise<IContactMapData> => {
  if (dir.length === 0) {
    return Promise.reject('Empty path.');
  }
  const contactMapFiles = ['coupling_scores.csv', 'distance_map.csv'];
  const promiseResults = await Promise.all(contactMapFiles.map(file => fetchCSVFile(`${dir}/${file}`)));
  const pdbData = await ChellPDB.createPDB(`${dir}/protein.pdb`);
  const data: CONTACT_MAP_DATA_TYPE = {
    couplingScores: getCouplingScoresData(promiseResults[0]),
    pdbData,
    secondaryStructures: pdbData.rawsecondaryStructure,
  };

  console.log(data.couplingScores);
  const seq = new Array<string>();
  for (let i = 0; i < 300; ++i) {
    const row = data.couplingScores.allContacts[i];
    if (row) {
      for (const col of row) {
        if (col && col.A_i && col.A_j) {
          if (col.i < col.j) {
            // console.log(`${col.i}: ${col.A_i}`);
            seq.push(col.A_i);
          } else {
            // console.log(`${col.j}: ${col.A_j}`);
            seq.push(col.A_j);
          }

          break;
        }
      }
    }
  }

  console.log(seq.join(''));

  return data;
};

/**
 * Parses a coupling_scores.csv file to generate the appropriate data structure.
 *
 * !Important!
 * The first line in the csv will be ignored as it is assumed to be a csv header.
 *
 * !Important!
 * Currently 13 fields are assumed to be part of a single coupling score.
 * As such, any rows with less thirteen will be ignored.
 *
 * @param line The csv file as a single string.
 * @returns Array of CouplingScores suitable for chell-viz consumption.
 */
export const getCouplingScoresData = (line: string): CouplingContainer => {
  const couplingScores = new CouplingContainer();
  line
    .split('\n')
    .filter(row => row.split(',').length >= 12)
    .map(row => {
      const items = row.split(',');
      couplingScores.addCouplingScore({
        i: parseFloat(items[0]),
        j: parseFloat(items[1]),
        // tslint:disable-next-line:object-literal-sort-keys
        cn: parseFloat(items[2]),
        A_i: items[10],
        A_j: items[11],
        dist: parseFloat(items[3]),
        // fn: parseFloat(items[4]),
        // segment_i: items[6],
        // segment_j: items[7],
        // probability: parseFloat(items[8]),
        // dist_intra: parseFloat(items[9]),
        // dist_multimer: parseFloat(items[10]),
        // precision: parseFloat(items[12]),
      });
    });
  return couplingScores;
};

/**
 * Parses a distance_map.csv file to generate the appropriate secondary structure mapping.
 *
 * !Important!
 * The first line in the csv will be ignored as it is assumed to be a csv header.
 *
 * !Important!
 * Currently 3 fields are assumed to be part of a single entry, with the second and third actually being relevant.
 * As such, any other rows will be ignored.
 *
 * @param line The csv file as a single string.
 * @returns Array of SecondaryStructure mappings suitable for chell-viz consumption.
 */
export const getSecondaryStructureData = (line: string): ISecondaryStructureData[] => {
  return line
    .split('\n')
    .slice(1)
    .filter(row => row.split(',').length >= 3)
    .map(row => {
      const items = row.split(',');
      return {
        resno: parseFloat(items[1]),
        structId: items[2] as keyof typeof SECONDARY_STRUCTURE_CODES,
      };
    });
};

/*
TODO Currently not being used by Spring. Remove? Use in future Spring work?
export const fetchColorData = async (file: string) => {
  const colorText: string = await fetchCSVFile(file);
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
*/
