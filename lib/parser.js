import hat from 'hat';
import omit from '101/omit';
import sax from 'sax';
import Node from './node';


export function parse(svgString) {
  let mapping = {};
  let svgRoot = {children: []};
  let ctx = svgRoot;
  let parser = sax.parser(true);

  parser.onopentag = (node) => {
    let id = node.attributes.id || hat();
    let parent = ctx;
    let child = {
      id: id,
      children: [],
      parent: parent,
    };

    parent.children.push(child);
    mapping[id] = Node(node, id, mapping[parent.id]);

    ctx = child;
  };

  parser.onclosetag = () => {
    let parent = ctx.parent;
    ctx = parent;
  };

  parser.write(svgString).close();

  return {root: omit(svgRoot.children[0], ['children']), mapping: mapping};
}
