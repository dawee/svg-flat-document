import * as matrix from './matrix';
import omit from '101/omit';
import pathBoundingBox from 'svg-path-bounding-box';


export default class Node {

  constructor(data, id, parent) {
    this.parent = parent;
    this.id = id;
    this.name = data.name;
    this.baseMatrix = matrix.fromTransformString(data.attributes.transform);
    this.attributes = Object.assign(
      parseStyleAttribute(data.attributes.style),
      omit(data.attributes, ['id', 'style', 'transform'])
    )

    this.absorbParentTransform();
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

  boundsToPoints(bounds) {
    return {
      topLeft: {
        x: bounds.left,
        y: bounds.top
      },
      topRight: {
        x: bounds.left + bounds.width,
        y: bounds.top
      },
      bottomRight: {
        x: bounds.left + bounds.width,
        y: bounds.top + bounds.height
      },
      bottomLeft: {
        x: bounds.left,
        y: bounds.top + bounds.height
      },
    };
  }

  pointsToBounds(points) {
    return {
      left: points.topLeft.x,
      top: points.topLeft.y,
      width: points.topRight.x - points.topLeft.x,
      height: points.bottomLeft.y - points.topLeft.y
    };
  }

  computeCircleBounds() {
    return {
      left: this.attributes.cx - this.attributes.r,
      top: this.attributes.cy - this.attributes.r,
      width: this.attributes.r * 2,
      height: this.attributes.r * 2
    };
  }

  computeEllipseBounds() {
    return {
      left: this.attributes.cx - this.attributes.rx,
      top: this.attributes.cy - this.attributes.ry,
      width: this.attributes.rx * 2,
      height: this.attributes.ry * 2
    };
  }

  computeRectBounds() {
    return {
      left: this.attributes.x,
      top: this.attributes.y,
      width: this.attributes.width,
      height: this.attributes.height
    };
  }

  computePathBounds() {
    let boundingBox = pathBoundingBox(this.attributes.d);

    return {
      left: boundingBox.x1,
      top: boundingBox.y1,
      width: boundingBox.width,
      height: boundingBox.height
    };
  }

  computeBounds() {
    let points = null;
    let bounds = null;

    switch (this.name) {
      case 'ellipse':
        bounds = this.computeEllipseBounds();
        break;
      case 'circle':
        bounds = this.computeCircleBounds();
        break;
      case 'rect':
        bounds = this.computeRectBounds();
        break;
      case 'path':
        bounds = this.computePathBounds();
        break;
      default:
        break;
    }

    if (!!bounds) {
      points = this.boundsToPoints(bounds);
      points.topLeft = this.matrix.applyToPoint(points.topLeft.x, points.topLeft.y);
      points.topRight = this.matrix.applyToPoint(points.topRight.x, points.topRight.y);
      points.bottomRight = this.matrix.applyToPoint(points.bottomRight.x, points.bottomRight.y);
      points.bottomLeft = this.matrix.applyToPoint(points.bottomLeft.x, points.bottomLeft.y);
      
      this.bounds = this.pointsToBounds(points);
    }
  }
}