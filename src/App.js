import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col, Navbar, Jumbotron, ListGroup, ListGroupItem, 
        Button, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table } from 'react-bootstrap';
        
var scheduleConfig = require('./scheduleConfig.json');
console.log(scheduleConfig.schedules[0].type);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="header">
          <Header />
        </div>
        <div className="container">
          <div>
            <ZipLookup />
          </div>
          <hr />
          <div>
            <LookupForm />
          </div>
          <hr />
          <div>
            <Results />
          </div>
          <div>
            <MfsKey />
          </div>
        </div>
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
        <Navbar staticTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">Medical Fee Schedule Lookup</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Grid>
        </Navbar>
    );
  }
}

class ZipLookup extends Component {
  render() {
    return (
      <div className="ZipLookup">
        <h2>Not sure what region to choose?</h2>
          <Form inline>
            <FormGroup>
                <HelpBlock>Enter the zip code of the location of service.</HelpBlock>
                <ControlLabel>Zip Code</ControlLabel>
                {"   "}
                <FormControl type="text" id="zip_input" placeholder="23220" />
                {"   "}
                <Button id="zip_submit" type="submit">Find Region</Button>
                <FormControl.Feedback />
            </FormGroup>
          </Form>
          <Alert bsStyle="success" className="zip-alert">
            Zip 23220 is: <strong>REGION 6</strong>
          </Alert>
      </div>
    );
  }
}

class LookupForm extends Component {
  
  static propTypes = {
    region: PropTypes.string.required,
    providerCategory: PropTypes.string.required,
    serviceCode: PropTypes.string.required,
    serviceDate: PropTypes.string,
    modifier: PropTypes.string,
    units: PropTypes.string,
    maxPayment: PropTypes.string
  };
  
  state = {
    region: null,
    providerCategory: null,
    serviceCode: null,
    serviceDate: null,
    modifier: null,
    units: null,
    maxPayment: null
  };
  
  render() {
    return (
      <div>
        <Form>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Region</ControlLabel>
                <FormControl componentClass="select">
                  <option value="">Choose Your Region</option>
                  <option value="Region 1">Region 1</option>
                </FormControl>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Provider Category</ControlLabel>
              <ProviderTypeSelect />
            </FormGroup>
          </Col>
          
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Secondary Type</ControlLabel>
              <SecondaryTypeSelect />
            </FormGroup>
          </Col>
          
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Service Code</ControlLabel>
              <FormControl type="text" id="service_code" />
            </FormGroup>
          </Col>
          
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Modifier</ControlLabel>
                <FormControl componentClass="select">
                  <option value=""> -- </option>
                  <option value="">PH</option>
                </FormControl>
            </FormGroup>
          </Col>
          
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Units</ControlLabel>
              <FormControl type="text" id="" />
            </FormGroup>
          </Col>

          <Col md={7}>
            <FormGroup>
              <ControlLabel></ControlLabel>
              <FormControl type="text" id="" />
            </FormGroup>
          </Col>

          <Button type="submit">Search</Button>
          {"  "}
          <Button>Add Another</Button>
          
        </Form>
      </div>
    );
  }
}

class ProviderTypeSelect extends Component {
  render() {
    var provOptions = [];
    // Refactor using .map when possible
    for(var i=0; i<scheduleConfig.schedules.length; i++) {
      provOptions.push(<option key={scheduleConfig.schedules[i].id} value={scheduleConfig.schedules[i].type}>{scheduleConfig.schedules[i].type}</option>);
     }
     
    return(
      <FormControl componentClass="select">
        <option value="">Select One</option>
        {provOptions}
      </FormControl>
    );
  }
}

class SecondaryTypeSelect extends Component {
  render() {
    var secondaryOptions = [];
    // Refactor using .map when possible?
    for(var i=0; i<scheduleConfig.schedules[0].secondaryType.length; i++) {
      let obj = scheduleConfig.schedules[0].secondaryType[i];
      let objArr = Object.keys(obj);
      for (var key in objArr) {
        secondaryOptions.push(<option value={objArr[key]}>{objArr[key]}</option>);
      }
     }
    
    return(
      <FormControl componentClass="select">
        <option value="">Select One</option>
        {secondaryOptions}
      </FormControl>
    );
  }
}

class Results extends Component {
  render() {
    return (
      <div>
        <h3>Search Results</h3>
        <Table bordered striped>
          <thead>
            <tr>
              <th>Code</th>
              <th>Region</th>
              <th>Type</th>
              <th>Modifier</th>
              <th>Maximum Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>90210</td>
              <td>4</td>
              <td>Inpatient Hospital Stay - Type One Teaching Hospital</td>
              <td>None</td>
              <td>$444,000</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

// Accept array of terms from results table and query MfsTerms.json
class MfsKey extends Component {
  render() {
    return (
        <div className="mfs-key">
          <h3>Key</h3>
          <ListGroup>
            <ListGroupItem header="Thing 1">This is the first one to show.</ListGroupItem>
            <ListGroupItem header="Thing 2">This is the second item to show.</ListGroupItem>
          </ListGroup>
        </div>
      );
  }
}

export default App;
