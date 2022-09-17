import { useEffect, useState } from 'react'
import PersonService from './services/Persons'
import './index.css'

const Filter = ({ filter, filterItems }) => (
  <div>
    filter shown with <input value={filter} onChange={filterItems} />
  </div>
)

const PersonForm = ({ addPerson, newName, handleName, newNumber, handleNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ filter, persons, removePerson }) => {
  const filtered = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(filter.toLowerCase()))

  return (
    filtered.map(
      person =>
        <p
          key={person.name}>{person.name} {person.number}
          <button onClick={() => removePerson(person.id, person.name)}>delete</button>
        </p>
    )
  )
}

const Alert = ({ notification, alertType }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className={`alert ${alertType}`}>
      {notification}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [alertType, setAlertType] = useState('')

  useEffect(() => {
    PersonService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleName = event => {
    setNewName(event.target.value)
  }

  const handleNumber = event => {
    setNewNumber(event.target.value)
  }

  const handleFilter = event => {
    setFilter(event.target.value)
  }

  const addPerson = event => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    const result = persons.find(({ name }) => name.toLowerCase() === newPerson.name.toLowerCase())
    result !== undefined
      ? changePerson(result.id, newPerson)
      : setPerson(newPerson)
  }

  const setPerson = newPerson => {
    PersonService
      .add(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotification(`Added ${newPerson.name}`)
        setAlertType('success')
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      })
      .catch(error => {
        console.log(error.response.data)
        setNotification(error.response.data.error)
          setAlertType('error')
          setTimeout(() => {
            setNotification(null)
          }, 4000)
      })
  }

  const changePerson = (id, newPerson) => {
    const message = `${newName} is already added to phonebook, replace the old number with a new one?`
    if (window.confirm(message)) {
      PersonService
        .update(id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`Changed number for ${newPerson.name}`)
          setAlertType('success')
          setTimeout(() => {
            setNotification(null)
          }, 4000)
        })
        .catch(() => {
          setNotification(`Information of ${newPerson.name} has already been removed from server`)
          setAlertType('error')
          setPersons(persons.filter(person => person.id !== id))
          setTimeout(() => {
            setNotification(null)
          }, 4000)
        })
    }
  }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      PersonService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification(`Removed ${name}`)
          setAlertType('success')
          setTimeout(() => {
            setNotification(null)
          }, 4000)
        })
        .catch(() => {
          setNotification(`Information of ${name} has already been removed from server`)
          setAlertType('error')
          setPersons(persons.filter(person => person.id !== id))
          setTimeout(() => {
            setNotification(null)
          }, 4000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Alert
        notification={notification}
        alertType={alertType}
      />
      <Filter
        filter={filter}
        filterItems={handleFilter}
      />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleName={handleName}
        newNumber={newNumber}
        handleNumber={handleNumber}
      />
      <h3>Numbers</h3>
      <Persons
        filter={filter}
        persons={persons}
        removePerson={removePerson}
      />
    </div>
  )
}

export default App