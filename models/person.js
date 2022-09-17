const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected')
  })
  .catch((error) => {
    console.log('errror:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (number => {
        return /^\d{2,3}-\d{6,}/.test(number)
      }),
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)