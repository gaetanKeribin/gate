const validate = require("validate.js");

exports.objectDoesNotContainFunctions = object => {
  for (let [key, value] of Object.entries(object)) {
    if (validate.isFunction(value) === true) {
      throw "Object is malicious.";
    }
  }
};
