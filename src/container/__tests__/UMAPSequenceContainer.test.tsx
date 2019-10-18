import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { act } from 'react-test-renderer';

import { UMAPSequenceContainerClass } from '~bioblocks-viz~/container';
import { Seq, SeqRecord } from '~bioblocks-viz~/data';
import { flushPromises } from '~bioblocks-viz~/test';

// tslint:disable-next-line: max-func-body-length
describe('UMAPSequenceContainer', () => {
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
example_sequence,EVA-NERV,59846,Bacteria,Firmicutes,Paenibacillus,Bacilli,Paenibacillaceae,Bacillales,Paenibacillus,chibensis`;
  });

  it('Should render when given an empty sequence.', () => {
    const wrapper = shallow(<UMAPSequenceContainerClass allSequences={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render when given a sequence.', () => {
    const wrapper = shallow(<UMAPSequenceContainerClass allSequences={sequences} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle a taxonomy update.', () => {
    const wrapper = shallow(<UMAPSequenceContainerClass allSequences={sequences} />);
    const expected = {
      example_sequence: {
        class: 'Bacilli',
        family: 'Bacillales',
        genus: 'Paenibacillus',
        order: 'Paenibacillus',
        phylum: 'Firmicutes',
        seq_name: 'example_sequence',
        sequence: 'EVA-NERV',
        species: 'chibensis',
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

  it('Should render an upload form when enabled.', () => {
    const wrapper = shallow(<UMAPSequenceContainerClass allSequences={sequences} showUploadButton={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should parse a taxonomy file with headers.', async () => {
    const wrapper = mount(
      <UMAPSequenceContainerClass allSequences={[]} labelCategory={'example_sequence'} showUploadButton={true} />,
    );
    const instance = wrapper.instance() as UMAPSequenceContainerClass;
    expect(instance.state.labels).toEqual([]);

    await act(async () => {
      wrapper
        .find('input')
        .simulate('change', { target: { files: { item: () => new File([taxonomyText], 'mock'), length: 1 } } });
    });

    await act(async () => {
      wrapper.update();
      instance.forceUpdate();
    });

    const expected = [
      'seq_name',
      'tax_id',
      'superkingdom',
      'phylum',
      'genus',
      'class',
      'subphylum',
      'family',
      'order',
      'species',
    ];
    expect(instance.state.labels).toEqual(expected);
  });

  it('Should parse a taxonomy file without headers.', async () => {
    const wrapper = mount(
      <UMAPSequenceContainerClass allSequences={[]} labelCategory={'example_sequence'} showUploadButton={true} />,
    );
    const instance = wrapper.instance() as UMAPSequenceContainerClass;
    expect(instance.state.labels).toEqual([]);
    const taxonomyTextNoHeaders = taxonomyText.split('\n')[1];
    await act(async () => {
      wrapper.find('input').simulate('change', {
        target: { files: { item: () => new File([taxonomyTextNoHeaders], 'mock'), length: 1 } },
      });
    });

    await act(async () => {
      wrapper.update();
    });

    const expected = new Array();
    expect(instance.state.labels).toEqual(expected);
  });

  it('Should gracefully handle an invalid taxonomy file.', async () => {
    const wrapper = mount(
      <UMAPSequenceContainerClass allSequences={[]} labelCategory={'example_sequence'} showUploadButton={true} />,
    );
    const instance = wrapper.instance() as UMAPSequenceContainerClass;
    expect(instance.state.labels).toEqual([]);
    await act(async () => {
      wrapper.find('input').simulate('change', { target: { files: null } });
    });

    await act(async () => {
      wrapper.update();
    });

    expect(instance.state.labels).toEqual([]);
  });

  it('Should handle updating the data.', async () => {
    const wrapper = shallow(<UMAPSequenceContainerClass allSequences={sequences} />);
    wrapper.setProps({
      allSequences: [new SeqRecord(new Seq('ggaattcc'))],
    });
    await act(async () => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle removing the taxonomy data.', async () => {
    const wrapper = shallow(<UMAPSequenceContainerClass allSequences={sequences} taxonomyText={taxonomyText} />);
    wrapper.setProps({
      taxonomyText: undefined,
    });
    await act(async () => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle missing annotation data.', async () => {
    const unannotatedSequences = sequences.map(seq => {
      seq.annotations.name = undefined;

      return seq;
    });

    const wrapper = shallow(
      <UMAPSequenceContainerClass allSequences={unannotatedSequences} taxonomyText={taxonomyText} />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('Should use hamming method for distance calculation.', async () => {
    const wrapper = mount(
      <UMAPSequenceContainerClass
        allSequences={[
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          new SeqRecord(new Seq('catCat')),
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
          ...sequences,
        ]}
      />,
    );
    const instance = wrapper.instance() as UMAPSequenceContainerClass;
    const spy = jest.spyOn(instance, 'equalityHammingDistance');
    expect(spy).not.toHaveBeenCalled();
    await act(async () => {
      wrapper.update();
      instance.forceUpdate();
    });
    jest.runAllTimers();
    expect(instance.equalityHammingDistance).toHaveBeenCalled();
  });
});
