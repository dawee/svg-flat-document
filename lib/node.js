const omit =  require('101/omit');
const Matrix =  require('transform-matrix');
const BoundingBox =  require('./boundingbox');


class Node {

  constructor(data, id, parent) {
    this.parent = parent;
    this.id = id;
    this.name = data.name;
    this.attributes = Object.assign(
      this.parseStyleAttribute(data.attributes.style),
      omit(data.attributes, ['id', 'style', 'transform'])
    )

    if (!!data.attributes.transform) {
      this.baseMatrix = Matrix.deserialize(data.attributes.transform);
    } else {
      this.baseMatrix = new Matrix();
    }

    this.absorbParentTransform();
    this.computeTransformString();
  }

  absorbParentTransform() {
    if (!!this.parent && !!this.parent.matrix) {
      this.matrix = this.parent.matrix.clone().multiply(this.baseMatrix);
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
    const boundingBox = BoundingBox.fromNodeAttributes(this.name, this.attributes);
    
    if (!!boundingBox) boundingBox.applyMatrix(this.matrix);

    return boundingBox;
  }

  computeTransformString() {
    this.attributes.transform = this.matrix.serialize();
  }
}

module.exports = Node;