import React from 'react'
import Styles from './Styles'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { Table, Card } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import {CalculateYearlyDeduction,CalculatePayPeriods,EMPLOYEE_PAY} from './deductions.js'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  console.log(CalculateYearlyDeduction(values))
  console.log(JSON.stringify(values, 0, 2))
}

function App() {
  return (
    <Styles>
      <h1>Paylocity Deduction Calculator</h1>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { push, pop }
          }, // injected from final-form-arrays above
          pristine,
          form,
          submitting,
          values
        }) => {
          return (
            <React.Fragment>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Employee</label>
                <Field name="employee" component="input" placeholder="Employee Name"/>
              </div>

              <FieldArray name="dependents">
                {({ fields }) =>
                  fields.map((name, index) => (
                    <div key={name}>
                      <label>Dep. #{index + 1}</label>
                      <Field
                        name={`${name}.depName`}
                        component="input"
                        placeholder="Dependent Name"
                      />
                      <span
                        onClick={() => fields.remove(index)}
                        style={{ cursor: 'pointer' }}
                      >
                      {/* eslint-disable-next-line */}
                        ❌
                      </span>
                    </div>
                  ))
                }
              </FieldArray>

              <div className="buttons">

              <button
                type="button"
                onClick={() => push('dependents', undefined)}
              >
                Add Dependent
              </button>
              <button type="button" onClick={() => pop('dependents')}>
                Remove Dependent
              </button>
                <button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div>
            </form>
            <h2>Deduction Breakdowns</h2>

            <div>
              <Card centered raised>
              <Card.Content>
                <Card.Header>Yearly Deduction Cost</Card.Header>
                </Card.Content>
                <Card.Content>
              <Table definition compact  color="red" key="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Cost</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    Object.keys(CalculateYearlyDeduction(values)).filter(name => name !== "TOTAL_COST").map(name => (
                    <Table.Row>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell>${CalculateYearlyDeduction(values)[name].toFixed(2)}</Table.Cell>
                    </Table.Row>
                  )
                  )}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell colSpan='1'>
                    <Table.Cell>Total Cost: ${CalculateYearlyDeduction(values)["TOTAL_COST"].toFixed(2)}</Table.Cell>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
              </Card.Content>
              </Card>

              {/* Paycheck Preview */}
              <Card centered raised>
              <Card.Content>
                <Card.Header>Paycheck Preview</Card.Header>
                </Card.Content>
                <Card.Content>
              <Table definition compact  color="orange" key="orange">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Pay Period</Table.HeaderCell>
                    <Table.HeaderCell>Pay</Table.HeaderCell>
                    <Table.HeaderCell>Amount Deducted</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    CalculatePayPeriods(26,CalculateYearlyDeduction(values)["TOTAL_COST"].toFixed(2))
                    .map((deduct, period) => (

                    <Table.Row>
                      <Table.Cell>{period+1}</Table.Cell>
                      <Table.Cell>${(EMPLOYEE_PAY-deduct).toFixed(2)}</Table.Cell>
                      <Table.Cell>${deduct}</Table.Cell>
                    </Table.Row>

                  )
                  )}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell colSpan='2'>
                    <Table.Cell>Total Pay: ${CalculatePayPeriods(26,CalculateYearlyDeduction(values)["TOTAL_COST"].toFixed(2))
                    .reduce(
                      ( accumulator, currentValue ) =>
                      accumulator + Number(EMPLOYEE_PAY - currentValue), 0
                      ).toFixed(2)}</Table.Cell>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
              </Card.Content>
              </Card>
              </div>
            </React.Fragment>
          )
        }}
      />
    </Styles>
  );
}

export default App;
