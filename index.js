/**
 * Prepend file name and number as part of the babel process
 *
 * @author Peter Ingram
 */

const babel = require("babel-core");

module.exports = ({ types: t }) => {
  return {
    visitor: {
      MemberExpression(path, state) {
        const node = path.node;
        const object = path.node.object;

        const notUndefined = t.binaryExpression(
          "!==",
          t.unaryExpression("typeof", t.identifier(object.name), true),
          t.stringLiteral("undefined")
        );

        path.parent.expression = t.logicalExpression("&&", notUndefined, node);
      }
    }
  };
};
