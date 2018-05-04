// tslint:disable:max-classes-per-file
declare module 'ngl' {
  export type ILoaderInput = File | Blob | string;

  /**
   * Load a file.
   *
   * @example // load from URL.
   * NGL.autoLoad( "http://files.rcsb.org/download/5IOS.cif" );
   *
   * @example // load binary data in CCP4 format via a Blob.
   * var binaryBlob = new Blob( [ ccp4Data ], { type: 'application/octet-binary'} );
   * NGL.autoLoad( binaryBlob, { ext: "ccp4" } );
   *
   * @example // load string data in PDB format via a Blob.
   * var stringBlob = new Blob( [ pdbData ], { type: 'text/plain'} );
   * NGL.autoLoad( stringBlob, { ext: "pdb" } );
   *
   * @example // load a File object.
   * NGL.autoLoad( file );
   *
   * @export
   * @returns Promise resolves to the loaded data.
   */
  export function autoLoad(file: ILoaderInput, params?: Partial<ILoaderParameters>): Promise<any>;
}
