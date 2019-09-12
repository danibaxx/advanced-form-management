import React, { useState } from 'react';
import { withFormik, Form, Field } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

// can deconstruct props
// const AnimalForm = (props) => {
//   return (
//     {props.errors.species && <p className='error'>{props.errors.species}</p>
//     <Field 
//     type="text" 
//     name="species" 
//     placeholder="Species" 
//   />
//   )
// }

const AnimalForm = ({ errors, touched, status }) => {
  // console.log(props)
  console.log(status)
  const [animals, setAnimals] = useState([])
  return (
    <Form>
      {touched.species && errors.species && <p className='error'>{errors.species}</p>}
      <Field 
        type="text" 
        name="species" 
        placeholder="Species" 
      />

      {touched.age && errors.age && <p className='error'>{errors.age}</p>}
      <Field
        type="number"
        name="age"
        placeholder="Age"
      />

      {touched.diet && errors.diet && <p className='error'>{errors.diet}</p>}
      <Field name="diet" component="select">
        <option value="" disabled>Select Diet:</option>
        <option value="carnivore">Carnivore</option>
        <option value="herbivore">Herbivore</option>
        <option value="omnivore">Omnivore</option>
      </Field>

      {touched.vaccinations && errors.vaccinations && <p className='error'>{errors.vaccinations}</p>}
      <label>
        <Field
          type="checkbox"
          name="vaccinations"
        />
      <span>Vaccinations</span>
      </label>

      <Field component="textarea" name="notes" placeholder="Notes" />

      <button type="submit">Submit</button>
      {/* less dry then the .map with spread operator*/}
      {/* Species {status.species}<br />}
      {Age {status.age}<br />}
      {Diet {status.diet}<br />}
      {Vaccinations {status.vaccinations}<br />*/}
      {animals.map(animal => {
        <div>Species: {animal.species}</div>
      })}
    </Form>
  )
}
// HOC = higher order component that takes in an component and returns a component
// HOC (withFormik), which then will return AnimalForm component
// mapPropsToValues = takes the props values and how to send them to the component that is passed in from withFormik.
// props is coming from withFormik to give access to that components info. (canBeNamedAnything).
export default withFormik({
  mapPropsToValues: (info) => {
    return {
      // some: 'value' === linked to "name" of each Field input within our Form
      // always need a default value after props.
      species: info.species || '',
      age: info.age || '',
      diet: info.diet || '',
      // checkboxes results in a boolean and not a string.
      vaccinations: info.vaccinations || false,
      notes: info.notes || ''
    }
  },

  validationSchema: yup.object().shape({
    species: yup.string().required('Species is required'),
    age: yup.number().required('Age is required').positive(),
    diet: yup.string().required('Diet is required'),
    vaccinations: yup.boolean().oneOf([true])
  }),

  handleSubmit: (info, { setStatus }) => {
    console.log(info)
    axios.post('https://reqres.in/api/animals', info)
      .then((response) => {
        setStatus(response.data)
      })
      .catch((error) => {
        console.log('Error', error)
      })
  }
})(AnimalForm);
