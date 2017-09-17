var mongoose = require('mongoose')
var MockSchema = require('../schemas/mock')
var Mock = mongoose.model('Mock', MockSchema)

module.exports = Mock