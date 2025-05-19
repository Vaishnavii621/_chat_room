const mongoose = require("mongoose")

const connectDB = (url) => {
    return mongoose.connect(process.env.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
}
module.exports = connectDB


