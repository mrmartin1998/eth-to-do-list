// SPDX-License-Identifier: MIT
const TodoList= artifacts.require("TodoList");

module.exports = function (deployer) {
  deployer.deploy(TodoList);
};
