import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col, Navbar, Jumbotron, ListGroup, ListGroupItem, 
        Button, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table } from 'react-bootstrap';

var _ = require('lodash');
        
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
  
  constructor(props) {
    super(props);
    this.state = {
      region: "NONE",
      providerCategory: "1",
      secondaryType: null,
      codeType: null,
      serviceCode: null
    };
    this.changeRegion = this.changeRegion.bind(this);
    this.changeProviderCategory = this.changeProviderCategory.bind(this);
  }
  
  changeRegion(event) { // Correct
    var newRegion = event.target.value;
    this.setState((state, props) => ({
      region: newRegion
    }));
  }
  
  changeProviderCategory(event) {
    var newProvCat = event.target.value;
    this.setState((state, props) => ({
      providerCategory: newProvCat
    }));
  }
  
  render() {
    return (
      <div>
        <Form>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Region</ControlLabel>
                <FormControl componentClass="select" onChange={this.changeRegion}>
                  <option value="">Choose Your Region</option>
                  <option value="Region 1">Region 1</option>
                  <option value="Region 2">Region 2</option>
                  <option value="Region 3">Region 3</option>
                  <option value="Region 4">Region 4</option>
                  <option value="Region 5">Region 5</option>
                  <option value="Region 6">Region 6</option>
                  <option value="Region 7">Region 7</option>
                </FormControl>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Provider Category</ControlLabel>
              <ProviderTypeSelect region={this.state.region} 
                                  providerCategory={this.state.providerCategory}
                                  secondaryType={this.state.secondaryType}
                                  codeType={this.state.codeType}
                                  serviceCode={this.state.serviceCode}
                                  changeProviderCategory={this.changeProviderCategory}/>
            </FormGroup>
          </Col>
          
          
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Code Type</ControlLabel>
              <CodeTypeInput />
            </FormGroup>
          </Col>
          
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Code</ControlLabel>
              <FormControl type="text" id="" />
            </FormGroup>
          </Col>
          
          <Col md={7}>
            <FormGroup>
              <ControlLabel>Provider Type</ControlLabel>
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
      provOptions.push(<option key={scheduleConfig.schedules[i].id} value={scheduleConfig.schedules[i].id}>{scheduleConfig.schedules[i].type}</option>);
     }
     
    return(
      <FormGroup>
        <FormControl componentClass="select" onChange={this.props.changeProviderCategory}>
          <option value="">Select One</option>
          {provOptions}
        </FormControl>
        
        <SecondaryTypeSelect region={this.props.region} 
                    providerCategory={this.props.providerCategory}
                    secondaryType={this.props.secondaryType}
                    codeType={this.props.codeType}
                    serviceCode={this.props.serviceCode}/>
      </FormGroup>
    );
  }
}

class SecondaryTypeSelect extends Component {
  
  render() {
    // Get the schedule object with the ID that matches the provider type choice
    var id = this.props.providerCategory;
    var obj = _.find(scheduleConfig.schedules, { 'id': id});
    console.log("Provider Category ID is: " + id);
    console.log("Provider Region is: " + this.props.region);
    console.log(obj);
    // Hide the field if it only has one option, which would be null.
    // if (obj.secondaryType.length === 1) {
      // return null;
    // }
    var secondaryOptions = [];
    for(var i=0; i<obj.secondaryType.length; i++) {
      // Iterate through and add to array. Note that for this component desired results are both a key AND value
      _.forEach(obj.secondaryType[i], function(key, opt) {
        secondaryOptions.push(<option value={opt}>{opt}</option>);
      });
     }
    
    return(
      <span>
        <ControlLabel>Secondary Type</ControlLabel>
        <FormControl componentClass="select">
          <option value="">Select One</option>
          {secondaryOptions}
        </FormControl>
      </span>
    );
  }
}

class CodeTypeInput extends Component {
  render() {
    var codeTypes = [];
    // Refactor using .map when possible?
    for(var i=0; i<scheduleConfig.schedules[0].secondaryType[0].Acute.codeType.length; i++) {
      let obj = scheduleConfig.schedules[0].secondaryType[0].Acute.codeType[i];
      let objArr = Object.keys(obj);
      for (var key in objArr) {
        codeTypes.push(<option value={objArr[key]}>{objArr[key]}</option>);
      }
     }
    
    return(
      <FormControl componentClass="select">
        <option value="">Select One</option>
        {codeTypes}
      </FormControl>
    );
  }
}

class Results extends Component {
  render() {
    return (
      <div>
      <hr />
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
