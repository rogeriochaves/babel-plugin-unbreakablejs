/**
 * Prepend file name and number as part of the babel process
 *
 * @author Peter Ingram
 */

const babel = require("babel-core");
const cloneDeep = require("clone-deep");

const replaceWithChecked = (path, newNode) => {
  newNode.checked = true;
  path.replaceWith(newNode);
};

const checkInsideLeftAsignment = currentPath => {
  while (currentPath && currentPath.parentPath) {
    if (
      currentPath.parentPath.node.type === "AssignmentExpression" &&
      currentPath.parentPath.node.left === currentPath.node
    ) {
      return currentPath.parentPath;
    }
    currentPath = currentPath.parentPath;
  }
  return false;
};

module.exports = ({ types: t }) => {
  return {
    visitor: {
      MemberExpression(path, _) {
        const node = path.node;
        if (node.checked) return;
        if (node.object.name === "console") return;

        var insideAsignmentLeft = checkInsideLeftAsignment(path);

        if (insideAsignmentLeft) {
          node.checked = true;
          const condition = cloneDeep(insideAsignmentLeft.node.left.object);
          const assignment = cloneDeep(insideAsignmentLeft.node);
          if (assignment.checked) return;
          assignment.checked = true;

          replaceWithChecked(
            insideAsignmentLeft,
            t.conditionalExpression(
              condition,
              assignment,
              t.identifier("undefined")
            )
          );
          t.conditionalExpression;
          return;
        }

        const computed = node.property.type !== "Identifier";
        if (node.object && node.object.name && node.object.name.match(/^_/))
          return;

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
        if (node.callee.property && node.callee.property.name === "call")
          return;

        replaceWithChecked(
          path,
          t.optionalCallExpression(node.callee, node.arguments, true)
        );
      },

      ThrowStatement(path, _) {
        const node = path.node;

        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier("console"), t.identifier("error")),
            [node.argument]
          )
        );
      }
    }
  };
};
