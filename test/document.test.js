const chai = require('chai');
const pick = require('101/pick');
const SVGFlatDocument = require('../lib/document');

const assert = chai.assert;

describe('SVGFlatDocument', () => {

  it('should parse a simple svg image', () => {
    let doc = SVGFlatDocument.parse('<svg width="100" height="200"></svg>');

    assert.deepEqual({width: '100', height: '200'}, pick(doc.root.attributes, ['width', 'height']));
  });

  it('should absorb parent matrix', () => {
    let doc = SVGFlatDocument.parse('<svg><g transform="translate(100, 0)"><g id="me" transform="translate(0, 100)"></g></g></svg>');

    assert.equal('matrix(1,0,0,1,100,100)', doc.mapping.me.attributes.transform);
  });

  it('should compute the bounding box with transform', () => {
    let doc = SVGFlatDocument.parse('<svg><rect id="me" transform="translate(100, 50)" x="0" y="0" width="100" height="200" /></svg>');

    assert.deepEqual({
      x: 100,
      y: 50,
      width: 100,
      height: 200
    }, pick(doc.mapping.me.computeBoundingBox(), ['x', 'y', 'width', 'height']));
  });

});