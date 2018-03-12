// tslint:disable:max-classes-per-file
declare module 'ngl' {
  export interface ILoaderParameters {
    /** File extension, determines file type. */
    ext?: string;

    /** Flag data as compressed. */
    compressed?: string | boolean;

    /** Flag data as binary. */
    binary?: boolean;

    /** Set data name. */
    name?: string;

    dir?: string;
    path?: string;
    protocol?: string;
  }
}
