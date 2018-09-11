import {
  CONTACT_MAP_DATA_TYPE,
  IContactMapData,
  ISecondaryStructureData,
  SECONDARY_STRUCTURE_CODES,
  VIZ_TYPE,
} from '../data/chell-data';
import { CouplingContainer } from '../data/CouplingContainer';
import { fetchCSVFile, fetchJSONFile, readFileAsText } from './FetchHelper';

import * as NGL from 'ngl';

import { ChellPDB } from '../data/ChellPDB';
import {
  ISpringCategoricalColorData,
  ISpringCategoricalColorDataInput,
  ISpringGraphData,
  ISpringLink,
  ISpringNode,
} from '../data/Spring';
import { getCouplingHeaderIndices } from './CouplingMapper';
import { generateResidueMapping, IResidueMapping } from './ResidueMapper';

export const fetchAppropriateData = async (viz: VIZ_TYPE, dataDir: string) => {
  switch (viz) {
    case VIZ_TYPE['T-SNE']:
    case VIZ_TYPE['T-SNE-FRAME']:
    case VIZ_TYPE['TENSOR-T-SNE']:
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

export const fetchAppropriateDataFromFile = async (viz: VIZ_TYPE, file: File) => {
  switch (viz) {
    case VIZ_TYPE.NGL:
      return fetchNGLDataFromFile(file);
    case VIZ_TYPE.CONTACT_MAP:
      return { couplingScores: getCouplingScoresData(await readFileAsText(file)) };
    default:
      return Promise.reject({ error: `Currently no appropriate data getter for ${viz} files` });
  }
};

const deriveSpringData = async (dataDir: string) => {
  const coordinates = await fetchSpringCoordinateData(`${dataDir}/coordinates.txt`);
  const graphData = await fetchGraphData(`${dataDir}/graph_data.json`);
  const catColorData = await fetchCategoricalColorData(`${dataDir}/categorical_coloring_data.json`);
  const nodeDict = getNodesFromGraph(graphData, coordinates, catColorData);
  graphData.links = assignSpringLinks(graphData.links, nodeDict);
  return graphData;
};

const assignSpringLinks = (links: ISpringLink[], nodeDict: { [index: number]: ISpringNode }) =>
  links.map(link => {
    const source = nodeDict[link.source as number];
    const target = nodeDict[link.target as number];
    if (source && target) {
      link.source = source;
      link.target = target;
    }
    return link;
  });

const getNodesFromGraph = (graphData: ISpringGraphData, coords: number[][], colorData: ISpringCategoricalColorData) => {
  const nodeDict: { [index: number]: ISpringNode } = {};
  for (let i = 0; i < graphData.nodes.length; ++i) {
    const node = graphData.nodes[i];
    nodeDict[node.number] = node;
    if (node.number in coords) {
      node.fixed = true;
      node.x = coords[node.number][0];
      node.y = coords[node.number][1];
    }
    const label = colorData.label_list[i];
    node.category = label;
    node.colorHex = colorData.label_colors[label];
  }
  return nodeDict;
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
      output.label_colors[key] = Number.parseInt('0x' + hex.slice(1), 16);
    } else {
      output.label_colors[key] = Number.parseInt(hex, 16);
    }
  }
  return output;
};

export const fetchSpringCoordinateData = async (file: string) => {
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

export const fetchTSneCoordinateData = async (dataDir: string) => {
  const colorText: string = await fetchCSVFile(`${dataDir}/tsne_output.csv`);
  const result: number[][] = [];
  colorText.split('\n').forEach(entry => {
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

export const fetchNGLDataFromFile = async (file: string | File | Blob, params: Partial<NGL.ILoaderParameters> = {}) =>
  (await NGL.autoLoad(file, params)) as NGL.Structure;

export const fetchContactMapData = async (dir: string): Promise<IContactMapData> => {
  if (dir.length === 0) {
    return Promise.reject('Empty path.');
  }
  const contactMapFiles = ['coupling_scores.csv', 'residue_mapping.csv'];
  const promiseResults = await Promise.all(contactMapFiles.map(file => fetchCSVFile(`${dir}/${file}`)));
  const pdbData = await ChellPDB.createPDB(`${dir}/protein.pdb`);
  const data: CONTACT_MAP_DATA_TYPE = {
    couplingScores: getCouplingScoresData(promiseResults[0], generateResidueMapping(promiseResults[1])),
    pdbData,
  };

  return data;
};

/**
 * Parses a coupling_scores.csv file to generate the appropriate data structure.
 *
 * !Important!
 * Currently 12 fields are assumed to be part of a single coupling score.
 * As such, any rows with less will be ignored.
 *
 * @param line The csv file as a single string.
 * @param residueMapping Maps the coupling_score.csv residue number to the pdb's residue number.
 * @returns Array of CouplingScores suitable for chell-viz consumption.
 */
export const getCouplingScoresData = (line: string, residueMapping: IResidueMapping[] = []): CouplingContainer => {
  const headerRow = line.split('\n')[0].split(',');
  const headerIndices = getCouplingHeaderIndices(headerRow);
  const isHeaderPresent = headerRow.includes('dist');
  const couplingScores = new CouplingContainer();
  line
    .split('\n')
    .slice(isHeaderPresent ? 1 : 0)
    .filter(row => row.split(',').length >= 12)
    .map(row => {
      const items = row.split(',');
      const uniProtIndexI = parseInt(items[0], 10) - 1;
      const uniProtIndexJ = parseInt(items[1], 10) - 1;
      if (residueMapping.length >= 1) {
        couplingScores.addCouplingScore({
          A_i: residueMapping[uniProtIndexI].pdbResname,
          A_j: residueMapping[uniProtIndexJ].pdbResname,
          cn: parseFloat(items[headerIndices.cn]),
          dist: parseFloat(items[headerIndices.dist]),
          i: residueMapping[uniProtIndexI].pdbResno,
          j: residueMapping[uniProtIndexJ].pdbResno,
        });
      } else {
        couplingScores.addCouplingScore({
          A_i: items[headerIndices.A_i],
          A_j: items[headerIndices.A_j],
          cn: parseFloat(items[headerIndices.cn]),
          dist: parseFloat(items[headerIndices.dist]),
          i: parseInt(items[headerIndices.i], 10),
          j: parseInt(items[headerIndices.j], 10),
        });
      }
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
