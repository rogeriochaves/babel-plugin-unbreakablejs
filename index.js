/**
 * Prepend file name and number as part of the babel process
 *
 * @author Peter Ingram
 */

const babel = require("babel-core");

const replaceWithChecked = (path, newNode) => {
  newNode.checked = true;
  path.replaceWith(newNode);
};

module.exports = ({ types: t }) => {
  return {
    visitor: {
      MemberExpression(path, _) {
        const node = path.node;
        if (node.checked) return;
        if (node.object.name === "console") return;

        const computed = node.property.type !== "Identifier";
        replaceWithChecked(
          path,
          t.optionalMemberExpression(node.object, node.property, computed, true)
        );
      },

      CallExpression(path, _) {
        const node = path.node;
        if (node.checked) return;
        if (
          node.callee.object &&
          node.callee.object.name === "console" &&
          ["log", "error", "warn"].includes(node.callee.property.name)
        )
          return;

        replaceWithChecked(
          path,
          t.optionalCallExpression(node.callee, node.arguments, true)
        );
      }
    }
  };
};
