import { shallow } from 'enzyme';
import * as React from 'react';

import { Seq, SeqRecord } from '~bioblocks-viz~/data';
import { UMAPSequenceContainer, UMAPTranscriptionalContainer, UMAPVisualization } from '~bioblocks-viz~/singlepage';

describe('UMAPVisualization', () => {
  let sequence: Seq;
  let sequences: SeqRecord[];
  let taxonomyText: string;

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    sequence = new Seq('gatcctag');
    sequences = [new SeqRecord(sequence)];
    // Taxonomy text based off betalactamase_alignment - PSE1_NATURAL_TAXONOMY.csv
    taxonomyText = `seq_name,sequence,tax_id,superkingdom,phylum,genus,class,subphylum,family,order,species\n\
example_sequence,EVA-NERV,59846,Bacteria,Firmicutes,Paenibacillus,Bacilli,Paenibacillaceae,Bacillales,Paenibacillus chibensis`;
  });

  describe('UMAPSequenceContainer', () => {
    it('Should render when given an empty sequence.', () => {
      const wrapper = shallow(<UMAPSequenceContainer allSequences={[]} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Should render when given a sequence.', () => {
      const wrapper = shallow(<UMAPSequenceContainer allSequences={sequences} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Should handle a taxonomy update.', () => {
      const wrapper = shallow(<UMAPSequenceContainer allSequences={sequences} />);
      const expected = {
        example_sequence: {
          class: 'Bacilli',
          family: 'Bacillales',
          genus: 'Paenibacillus',
          order: 'Paenibacillus chibensis',
          phylum: 'Firmicutes',
          seq_name: 'example_sequence',
          sequence: 'EVA-NERV',
          subphylum: 'Paenibacillaceae',
          superkingdom: 'Bacteria',
          tax_id: '59846',
        },
      };
      wrapper.setProps({
        taxonomyText,
      });
      expect(wrapper.state('seqNameToTaxonomyMetadata')).toEqual(expected);
    });
  });

  describe('UMAPTranscriptionalContainer', () => {
    it('Should render when given an empty data matrix.', () => {
      const wrapper = shallow(<UMAPTranscriptionalContainer dataMatrix={[[]]} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('UMAPVisualization', () => {
    it('Should render when given an empty data matrix.', () => {
      const wrapper = shallow(<UMAPVisualization dataMatrix={[[]]} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Should render when given some sample data.', () => {
      const dataMatrix: number[][] = new Array(30);
      for (let i = 0; i < 30; ++i) {
        dataMatrix[i] = new Array(30);
        for (let j = 0; j < 30; ++j) {
          dataMatrix[i][j] = i * 30 + j;
        }
      }
      const wrapper = shallow(<UMAPVisualization dataMatrix={dataMatrix} />);

      jest.runAllTimers();
      expect(wrapper.state('umapEmbedding')).toHaveLength(30);
    });
  });
});
