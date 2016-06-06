import chai from 'chai';
import pick from '101/pick';
import SVGFlatDocument from '../lib/document';

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

});