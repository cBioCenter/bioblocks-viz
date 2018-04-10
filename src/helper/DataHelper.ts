import * as d3 from 'd3';
import { ISpringCategoricalColorData, ISpringCategoricalColorDataInput, ISpringGraphData } from 'spring';
import { VIZ_TYPE } from '../component/VizSelectorPanel';

export const fetchAppropriateData = async (viz: VIZ_TYPE, dataDir: string) => {
  switch (viz) {
    case VIZ_TYPE['T-SNE']:
      return fetchTSneCoordinateData(dataDir);
    case VIZ_TYPE.SPRING:
      return deriveSpringData(dataDir);
    default:
      console.log(`Currently not appropriate data getter for ${viz}`);
  }
};

const deriveSpringData = async (dataDir: string) => {
  try {
    const coordinates = await fetchSpringCoordinateData(`assets/${dataDir}/coordinates.txt`);
    const graphData = await fetchGraphData(`assets/${dataDir}/graph_data.json`);
    // const colorData = await this.fetchColorData(`assets/${this.props.dataDir}/color_data_gene_sets.csv`);
    const catColorData = await fetchCategoricalColorData(`assets/${dataDir}/categorical_coloring_data.json`);

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
  } catch (e) {
    console.log(`Error fetching Spring data:\n${e}`);
  }
};

export const fetchCategoricalColorData = async (file: string): Promise<ISpringCategoricalColorData> => {
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

export const fetchSpringCoordinateData = async (file: string) => {
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

export const fetchTSneCoordinateData = async (dataDir: string) => {
  const colorText: string = await d3.text(`assets/${dataDir}/tsne_output.csv`);
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

export const fetchGraphData = async (file: string) => {
  const data = (await d3.json(file)) as ISpringGraphData;
  if (!data.nodes || !data.links) {
    throw new Error('Unable to parse graph_data - does it have node key(s)?');
  }
  return data;
};
