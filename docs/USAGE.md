# Bioblocks Usage

<!-- TOC -->

- [Bioblocks Usage](#bioblocks-usage)
  - [React](#react)
  - [Data](#data)
    - [Fetching](#fetching)
    - [Biological Types](#biological-types)
  - [IFrame](#iframe)

<!-- /TOC -->

## React

Dropping in Bioblocks visualization components into your existing react application is no different from any other component library. Just import and render!

```jsx
import { PredictedContactMap } from 'bioblocks-viz';
import * as React from 'react';

export const MyComponent = props => (
  <div>
    Hey, check it out!
    <PredictedContactMap data={props.data} />
  </div>
);
```

Bioblocks is built with [TypeScript](https://www.typescriptlang.org/), meaning static type checking comes right out of the box for your tooling needs!

```tsx
import { IContactMapData, PredictedContactMap } from 'bioblocks-viz';
import * as React from 'react';

export interface IMyProps {
  data: IContactMapData;
  yourPropHere: string;
}

export const MyComponent = (props: IMyProps) => (
  <div>
    <PredictedContactMap data={props.data} />
  </div>
);
```

## Data

In addition to visualization components, bioblocks-viz exposes a number of functions and classes to help you manage your data.

### Fetching

Helper functions to help you quickly get your data from external sources - All with interchangeable support consumption via async/await and promises!

```ts
import { fetchCSVFile, fetchJSONFile, fetchNGLDataFromFile } from 'bioblocks-viz';

const csvFile = await fetchCSVFile('somewhere-over-the-rainbow.csv');
const jsonFile = await fetchJSONFile('somewhere-under-the-rainbow.csv');
const nglFile = fetchNGLDataFromFile('through-the-looking-glass.pdb').then(pdbFile => pdbFile);
```

### Biological Types

Bioblocks also exports types to better strengthen your code when dealing with biological constants:

```ts
import { AminoAcid, Nucleotide } from 'bioblocks-viz';

const valine = AminoAcid.Valine;
const adenine = Nucleotide.Adenine;

console.log(valine.singleLetterCode); // V
console.log(valine.codons); // ["GTT", "GTC", "GTA", "GTG"]
console.log(adenine.getComplementDNA()); // { fullName: "Thymine", singleLetterCode: "T" }
console.log(Nucleotide.Thymine === adenine.getComplementDNA()); // true
```

## IFrame

Please refer to our dedicated [iFrame Usage Page](./IFRAME_SETUP.md)
