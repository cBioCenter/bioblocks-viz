declare module 'react-full-screen' {
  interface IReactFullscreenProps {
    enabled: boolean;
    onChange?(isFullscreen: boolean): void;
  }
  // tslint:disable-next-line:export-name
  export default class FullScreen extends React.Component<IReactFullscreenProps> {}
}
