import hat from 'hat';
import omit from '101/omit';
import sax from 'sax';
import Node from './node';

export default class SVGFlatDocument {

  constructor() {
    this.mapping = {};
    this.root = null;
  }

  parse(svgString) {
    let svgRoot = {children: []};
    let ctx = svgRoot;
    let parser = sax.parser(true);

    parser.onopentag = (data) => {
      let id = data.attributes.id || hat();
      let parent = ctx;
      let child = {id: id, children: [], parent: parent};
      let node = Node(data, id, this.mapping[parent.id])

      ctx = child;
      this.mapping[id] = node;

      if (this.root === null) this.root = node;

      parent.children.push(child);
    };

    parser.onclosetag = () => ctx = ctx.parent;
    parser.write(svgString).close();
  }
}
