declare module 'react-iframe-comm' {
  /*
      Iframe Attributes
      https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#Attributes
      React Supported Attributes
      https://facebook.github.io/react/docs/dom-elements.html#all-supported-html-attributes
      Note: attributes are camelCase, not all lowercase as usually defined.
    */
  export interface IframeCommAttributes {
    allowFullScreen?: string | boolean;
    frameBorder?: string | number;
    height?: string | number;
    name?: string;
    scrolling?: string;
    // https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
    sandbox?: string;
    srcDoc?: string;
    src: string;
    width?: string | number;
  }

  interface IframeCommProps {
    attributes: IframeCommAttributes;

    /*
      You can pass it anything you want, we'll serialize to a string
      preferably use a simple string message or an object.
      preferably an object, you need to follow the same naming convention
      in the iframe so you can parse it accordingly.
    */
    postMessageData: any;

    /*
      Enable use of the browser's built-in structured clone algorithm for serialization
      by settings this to `false`.
      Default is `true`, using our built in logic for serializing everything to a string.
    */
    serializeMessage?: boolean;

    /*
      Always provide a specific targetOrigin, not *, if you know where the other window's document should be located.
      Failing to provide a specific target discloses the data you send to any interested malicious site.
    */
    targetOrigin?: string;

    // Callback function called when iFrame sends the parent window a message.
    handleReceiveMessage?(...args: any[]): any;

    /*
      Callback function called when iframe loads.
      We're simply listening to the iframe's `window.onload`.
      To ensure communication code in your iframe is totally loaded,
      you can implement a syn-ack TCP-like handshake using `postMessageData` and `handleReceiveMessage`.
    */
    handleReady?(...args: any[]): any;
  }
  // tslint:disable-next-line:export-name
  export default class IframeComm extends React.Component<IframeCommProps> {}
}
