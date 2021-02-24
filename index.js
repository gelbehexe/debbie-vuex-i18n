if (process.env.NODE_ENV === "production") {
    module.exports = require("./dist/index")
} else {
    module.exports = require("./src/index")
}
