import omit from '101/omit';
import Matrix from 'transform-matrix';
import BoundingBox from './boundingbox';


export default class Node {

  constructor(data, id, parent) {
    this.parent = parent;
    this.id = id;
    this.name = data.name;
    this.baseMatrix = Matrix.deserialize(data.attributes.transform);
    this.attributes = Object.assign(
      parseStyleAttribute(data.attributes.style),
      omit(data.attributes, ['id', 'style', 'transform'])
    )

    this.absorbParentTransform();
    this.computeBoundingBox();
  }

  absorbParentTransform() {
    if (!!this.parent && !!this.parent.matrix) {
      this.matrix = this.parent.matrix.clone().multiply(baseMatrix);
    } else {
      this.matrix = this.baseMatrix;
    }
  }

  parseStyleAttribute(styleAttribute) {
    let style = {};

    (styleAttribute || '').split(';').forEach((line) => {
      let match = line.match(/^\s*(.*)\s*:\s*(.*)\s*$/);

      if (!!match) style[match[1]] = match[2];
    });

    return style;
  }

  computeBoundingBox() {
    this.boundingBox = this.boundingBox || BoundingBox.fromNodeAttributes(
      this.name,
      this.attributes
    );
    
    this.boundingBox.applyMatrix(this.matrix);
  }

  computeTransformString() {
    this.attributes.transform = this.matrix.serialize();
  }
}
