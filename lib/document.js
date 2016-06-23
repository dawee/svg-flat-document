const hat = require('hat');
const omit = require('101/omit');
const sax = require('sax');
const Node = require('./node');


class SVGFlatDocument {

  constructor(root, mapping) {
    this.root = root;
    this.mapping = mapping;
  }

  static parse(svgString) {
    let mapping = {};
    let root = null;
    let svgRoot = {children: []};
    let ctx = svgRoot;
    let parser = sax.parser(true);

    parser.onopentag = (data) => {
      let id = data.attributes.id || hat();
      let parent = ctx;
      let child = {id: id, children: [], parent: parent};
      let node = new Node(data, id, mapping[parent.id])

      ctx = child;
      mapping[id] = node;

      if (root === null) root = node;

      parent.children.push(child);
    };

    parser.onclosetag = () => ctx = ctx.parent;
    parser.write(svgString).close();

    return new SVGFlatDocument(root, mapping);
  }
}

module.exports = SVGFlatDocument;