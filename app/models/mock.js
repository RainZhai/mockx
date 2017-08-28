var mongoose = require('mongoose')
var MockSchema = require('../schemas/mock')
var Mock = mongoose.model('Movie', MockSchema)

module.exports = Mock