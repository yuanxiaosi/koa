"use strict";

const config = require('config')
const res = config.get('project')
console.log(res)

require("./src/root")