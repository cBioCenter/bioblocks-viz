/// <reference types="react" />
import * as React from 'react';
export interface ICategorySelectorProps {
  categories: string[];
  onCategoryChange?: (event: React.SyntheticEvent<any>, data: object) => void;
}
export declare class CategorySelector extends React.Component<ICategorySelectorProps, any> {
  constructor(props: ICategorySelectorProps);
  public render(): JSX.Element;
}
