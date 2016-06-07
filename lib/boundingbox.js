import pathBoundingBox from 'svg-path-bounding-box';


export default class BoundingBox {

  constructor(attributes, parser) {
    this.parser = parser;

    this.parseAttributes(attributes);
  }

  parseAttributes(attributes) {
    Object.assign(this, this.parser(attributes));
  }

  applyMatrix(matrix) {
    let topLeft = matrix.applyToPoint(this.x, this.y);
    let bottomRight = matrix.applyToPoint(this.x + this.width, this.y + this.height);

    this.x = topLeft.x;
    this.y = topLeft.y;
    this.width = bottomRight.x - topLeft.x;
    this.height = bottomRight.y - topLeft.y;
  }

  static fromNodeAttributes(nodeName, attributes) {
    if (nodeName in mapping) {
      return mapping[nodeName](attributes);
    } else {
      return null;
    }
  }

  static fromCircleAttributes(attributes) {
    return new BoundingBox(attributes, (attributes) => ({
      x: attributes.cx - attributes.r,
      y: attributes.cy - attributes.r,
      width: attributes.r * 2,
      height: attributes.r * 2
    }));
  }

  static fromEllipseAttributes(attributes) {
    return new BoundingBox(attributes, (attributes) => ({
      x: attributes.cx - attributes.rx,
      y: attributes.cy - attributes.ry,
      width: attributes.rx * 2,
      height: attributes.ry * 2
    }));
  }

  static fromRectAttributes(attributes) {
    return new BoundingBox(attributes, (attributes) => ({
      x: attributes.x,
      y: attributes.y,
      width: attributes.width,
      height: attributes.height
    }));
  }

  static fromPathAttributes(attributes) {
    let boundingBox = pathBoundingBox(attributes.d);

    return new BoundingBox(attributes, (attributes) => ({
      x: boundingBox.x1,
      y: boundingBox.y1,
      width: boundingBox.width,
      height: boundingBox.height
    }));
  }

}

const mapping = {
  rect: BoundingBox.fromRectAttributes,
  circle: BoundingBox.fromCircleAttributes,
  ellipse: BoundingBox.fromEllipseAttributes,
  path: BoundingBox.fromPathAttributes
};
