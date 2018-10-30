import * as igv from 'igv';
import * as React from 'react';

export interface IIGVContainerProps {
  dataUrl: string;
  style: React.CSSProperties;
}

export class IGVContainer extends React.Component<IIGVContainerProps, any> {
  public static defaultProps = {
    dataUrl: `https://data.broadinstitute.org/\
      igvdata/1KG/b37/data/HG02450/alignment/HG02450.mapped.ILLUMINA.bwa.ACB.low_coverage.20120522.bam`,
    style: {
      height: '600px',
      width: '600px',
    },
  };
  protected divRef: HTMLDivElement | null = null;
  constructor(props: IIGVContainerProps) {
    super(props);
  }

  public async componentDidMount() {
    const options: object = {
      genome: 'hg19',
      locus: 'chr8:128,747,267-128,754,546',
      tracks: [
        {
          format: 'bam',
          name: 'HG02450',
          type: 'alignment',
          url: this.props.dataUrl,
        },
      ],
    };

    await igv.createBrowser(this.divRef, options);
    console.log('Created IGV browser');
  }

  public render() {
    const { style } = this.props;

    return <div className={'igv-container'} ref={node => (this.divRef = node ? node : null)} style={style} />;
  }
}
