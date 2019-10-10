# [Bioblocks Visualization Library](https://cbiocenter.github.io/bioblocks-viz/)

[![npm version](https://badge.fury.io/js/bioblocks-viz.svg)](https://badge.fury.io/js/bioblocks-viz)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://cbiocenter.github.io/bioblocks-viz/storybook)
[![CircleCI](https://circleci.com/gh/cBioCenter/bioblocks-viz.svg?style=shield)](https://circleci.com/gh/cBioCenter/bioblocks-viz)
[![GitHub license](https://img.shields.io/github/license/cBioCenter/bioblocks-viz.svg?style=flat)](https://github.com/cBioCenter/bioblocks-viz/blob/master/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![Coverage Status](https://img.shields.io/codecov/c/github/cBioCenter/bioblocks-viz/master.svg)](https://codecov.io/gh/cBioCenter/bioblocks-viz/branch/master)

## Intro

Visualization components displaying biological data, such as with [ContactMap.org](https://www.contactmap.org) or [Bioblocks Portal](https://github.com/cBioCenter/bioblocks-portal) for the [Human Cell Atlas](https://www.humancellatlas.org/).

Check out the [API Docs](https://cbiocenter.github.io/bioblocks-viz/docs/api/index.html), some [live examples](https://cbiocenter.github.io/bioblocks-viz), our [storybook](https://cbiocenter.github.io/bioblocks-viz/storybook), or even the [Contact Map](http://contactmap.org) site!

## Installation

We're on [NPM](https://www.npmjs.com/) so you can install using your favorite package manager:

```sh
yarn install bioblocks-viz
```

```TypeScript
import * as React from 'react';
import {
  fetchMatrixData,
  UMAPTranscriptionalContainer,
} from 'bioblocks-viz';

const data = await fetchMatrixData('somewhere-over-the-rainbow-is-this-matrix.csv'); // Returns number[][]

<UMAPTranscriptionalContainer
  dataMatrix={data}
  numIterationsBeforeReRender={1}
  numSamplesToShow={5000}
/>
```

- Install dependencies with [yarn](https://yarnpkg.com/):

```sh
cd bioblocks-viz
yarn
```

- Start a local server to see the components in action!

```sh
yarn start
```

## Examples

- [Storybook](https://cbiocenter.github.io/bioblocks-viz/storybook/)
- [UMAP & TSNE](https://cbiocenter.github.io/bioblocks-viz/)
- [Bioblocks Portal](https://cbiocenter.github.io/bioblocks-portal/)
- [ContactMap.org](https://www.contactmap.org)

## Getting Started (For Development Use)

Please see the [Getting Started](https://cbiocenter.github.io/bioblocks-viz/docs/DEV_GETTING_STARTED.md) page for an introduction to the bioblocks-viz development environment!
