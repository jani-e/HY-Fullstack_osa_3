const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://janifullstack:${password}@cluster-jani.xtexvlu.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: personName,
  number: personNumber,
})

const savePerson = () => {
  person.save().then(() => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
}

const listAllPeople = () => {
  console.log('phonebook:')
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
      process.exit(1)
    })
}

if (process.argv.length === 3) {
  listAllPeople()
}

if (process.argv.length === 5) {
  savePerson()
}