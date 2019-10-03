# Using Bioblocks in an IFrame

<!-- TOC -->

- [Using Bioblocks in an IFrame](#using-bioblocks-in-an-iframe)
  - [Instantiation](#instantiation)
    - [HTML Only](#html-only)
    - [Non-Framework HTML and JavaScript](#non-framework-html-and-javascript)
    - [React](#react)
  - [Sending Data](#sending-data)

<!-- /TOC -->

## Instantiation

### HTML Only

If you would like to use bioblocks in an environment with a lot of HTML and inline scripts, never fear! To get started you just need to add an iframe element. For example, a nicely sized Contact Map that allows expanding to full screen:

```html
<iframe
  allowfullscreen="true"
  id="bioblocks-frame"
  src="./node_modules/bioblocks-viz/bioblocks.html"
  onload="startBioblocks()"
  width="525"
  height="530"
></iframe>
```

And the appropriate scriptlet:

```html
<script>
  function startBioblocks(e) {
    const iframe = document.getElementById("bioblocks-frame");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          viz: "Contact Map"
        },
        "*"
      );
    }
</script>
```

### Non-Framework HTML and JavaScript

In this scenario, your project is mostly html and js files with usage of jquery and/or `document.getElement` calls.

For the HTML, you could easily use the element defined in [the basic HTML example](#html-only). But, to really separate our code, let's set the attributes in JavaScript. So our HTML element has been trimmed to:

```html
<iframe id="bioblocks-frame"></iframe>
```

Now, in the JavaScript:

```js
const iframe = document.getElementById('bioblocks-frame');
if (iframe && iframe.contentWindow) {
  iframe.setAttribute('allow', 'fullscreen');
  iframe.setAttribute('width', '525');
  iframe.setAttribute('height', '581');
  iframe.setAttribute('src', './node_modules/bioblocks-viz/bioblocks.html');

  iframe.addEventListener('load', () => {
    iframe.contentWindow.postMessage(
      {
        names: new Array(100).fill(0).map((value, index) => index.toString()),
        seqs: new Array(100).fill(1).map((value, index) => index.toString()),
        viz: 'UMAP Sequence',
      },
      '*',
    );
  });
}
```

This will produce 100 data points in a UMAP component. Neat!

### React

Coming Soon™ - A component to encapsulate an instance of bioblocks in an iFrame! In the meantime, please take a look at our [regular react usage guide](./USAGE.md#bioblocks-viz-usage).

## Sending Data

Now let's see how we can send your existing application data to an iFrame'd bioblocks for visualization. Consider the following function that returns some domain-specific data[^1].

```js
const fetchData = () => {
  const data = {
    songNames: [
      'Henrietta',
      'Flathead',
      'Whistle for the Choir',
      'Chelsea Dagger',
      'For the Girl',
      'Creepin Up The Backstairs',
      'Everybody Knows You Cried Last Night',
      'Baby Fratelli',
      'Ole Black ‘n’ Blue Eyes',
      'The Gutterati?',
      'Dirty Barry Stole The Bluebird',
      'My Friend John',
      'A Heady Tale',
      'Look Out Sunshine!',
      'Milk and Money',
      "Moriarty's Last Stand",
    ],
    songLengths: [
      '3:32',
      '3:17',
      '3:35',
      '3:35',
      '2:48',
      '3:07',
      '3:54',
      '3:56',
      '3:16',
      '2:28',
      '4:04',
      '3:02',
      '4:53',
      '3:53',
      '4:43',
      '4:11',
    ],
  };
  return data;
};
```

And now to send the data to our iframe, we can send a message like so:

```js
const data = fetchData();
iframe.contentWindow.postMessage(
  {
    names: data.songNames.map(name => name),
    seqs: data.songLengths.map(length => length),
    viz: 'UMAP Sequence',
  },
  '*',
);
```

Please refer to our [API Documentation](https://cbiocenter.github.io/bioblocks-viz/docs/api/index.html) for the various visualization types and associated property names for data sending.

[^1]: The domain in this case being good music.
