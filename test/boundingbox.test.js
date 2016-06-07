import chai from 'chai';
import pick from '101/pick';
import BoundingBox from '../lib/boundingbox';
import Matrix from 'transform-matrix';

const assert = chai.assert;
const assertValues = (name, values, attributes) => {
  assert.deepEqual(values, pick(
    BoundingBox.fromNodeAttributes(name, attributes),
    ['x', 'y', 'width', 'height']
  ));
};

describe('BoundingBox', () => {

  it('should parse rect attributes', () => {
    let values = {x: 0, y: 0, width: 100, height: 200};
    let attributes = values;

    assertValues('rect', values, attributes);
  });

  it('should parse circle attributes', () => {
    let values = {x: 0, y: 0, width: 100, height: 100};
    let attributes = {cx: 50, cy: 50, r: 50};

    assertValues('circle', values, attributes);
  });

  it('should parse ellipse attributes', () => {
    let values = {x: 0, y: 0, width: 100, height: 200};
    let attributes = {cx: 50, cy: 100, rx: 50, ry: 100};

    assertValues('ellipse', values, attributes);
  });

  it('should parse path attributes', () => {
    let values = {x: 0, y: 0, width: 100, height: 200};
    let attributes = {d: 'm0,0 h 100 v 200 h -100 v -200'};

    assertValues('path', values, attributes);
  });

  it('should apply a translation', () => {
    let values = {x: 100, y: 0, width: 100, height: 200};
    let box = BoundingBox.fromNodeAttributes('rect', {x: 0, y: 0, width: 100, height: 200});
    let matrix = new Matrix().translate(100, 0);

    box.applyMatrix(matrix);
    assert.deepEqual(values, pick(box, ['x', 'y', 'width', 'height']));
  });

});