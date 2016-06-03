# SVGFlatDocument

ES6 SVG document without tree (flat)

## Install

```
npm install svg-flat-document
```

## Usage

## Parse from SVG string

```js
import SVGFlatDocument from 'svg-flat-document';

let doc = new SVGFlatDocument().parse('
<svg width=100>
  <g transform="translate(100, 0)">
    <rect id="me" x="0" y="0" width="100" height="200" />
  </g>
</svg>
');

```

## Retreive element

```js

let node = doc.mapping.me;
let attr = node.attributes;

console.log(attr.x, attr.y, attr.width, attr.height);
// 0 0 100 200

console.log(attr.transform);
// matrix(1,0,0,1,100,0)

```

So groups are ignored and children absorb every parents transforms.