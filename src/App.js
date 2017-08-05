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
  
  constructor(props) {
    super(props);
    this.state = {
      region: "Region 1",
      serviceType: "1",
      secondaryType: "Acute",
      codeType: "DRG",
      providerType: null,
      serviceCode: null
    };
    this.changeRegion = this.changeRegion.bind(this);
    this.changeServiceType = this.changeServiceType.bind(this);
    this.changeSecondaryType = this.changeSecondaryType.bind(this);
    this.changeCodeType = this.changeCodeType.bind(this);
    this.changeProviderType = this.changeProviderType.bind(this);
  }
  
  changeRegion(event) { // Correct
    var newRegion = event.target.value;
    this.setState((state, props) => ({
      region: newRegion
    }));
  }
  
  changeServiceType(event) {
    var newServType = event.target.value;
    this.setState((state, props) => ({
      serviceType: newServType
    }));
  }
  
  changeSecondaryType(event) {
    var newSecType = event.target.value;
    this.setState((state, props) => ({
      secondaryType: newSecType
    }));
  }
  
  changeCodeType(event) {
    var newCodeType = event.target.value;
    this.setState((state, props) => ({
      codeType: newCodeType
    }));
  }
  
  changeProviderType(event) {
    var newProvType = event.target.value;
    this.setState((state, props) => ({
      providerType: newProvType
    }));
  }
  
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
            <LookupForm region={this.state.region} 
                        serviceType={this.state.serviceType}
                        secondaryType={this.state.secondaryType}
                        codeType={this.state.codeType}
                        serviceCode={this.state.serviceCode}
                        providerType={this.state.providerType}
                        changeServiceType={this.changeServiceType}
                        changeRegion={this.changeRegion}
                        changeCodeType={this.changeCodeType} 
                        changeSecondaryType={this.changeSecondaryType} 
                        changeProviderType={this.changeProviderType}/>
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
  
  render() {
    return (
      <div>
        <Form>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Region</ControlLabel>
              <RegionSelect changeRegion={this.props.changeRegion}/>
            </FormGroup>
          </Col>
          
          <Col md={9}>
            <FormGroup>
              <ControlLabel>Fee Schedule - Service Type</ControlLabel>
              <ServiceTypeSelect region={this.props.region} 
                                  serviceType={this.props.serviceType}
                                  secondaryType={this.props.secondaryType}
                                  codeType={this.props.codeType}
                                  providerType={this.props.providerType}
                                  serviceCode={this.props.serviceCode}
                                  changeServiceType={this.props.changeServiceType}/>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
            <ControlLabel>Secondary Service Type</ControlLabel>
            <SecondaryTypeSelect region={this.props.region} 
                                 serviceType={this.props.serviceType}
                                 secondaryType={this.props.secondaryType}
                                 codeType={this.props.codeType}
                                 providerType={this.props.providerType}
                                 serviceCode={this.props.serviceCode} 
                                 changeSecondaryType={this.props.changeSecondaryType}/>
            </FormGroup>
          </Col>
          
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Code Type</ControlLabel>
              <CodeTypeInput region={this.props.region} 
                  serviceType={this.props.serviceType}
                  secondaryType={this.props.secondaryType}
                  codeType={this.props.codeType}
                  providerType={this.props.providerType}
                  serviceCode={this.props.serviceCode}
                  changeCodeType={this.props.changeCodeType} />
            </FormGroup>
          </Col>
          
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Code</ControlLabel>
              <FormControl type="text" id="" />
            </FormGroup>
          </Col>
          
          <Col md={12}>
            <FormGroup>
              <ControlLabel>Provider Type</ControlLabel>
              <ProviderTypeInput region={this.props.region} 
                                  serviceType={this.props.serviceType}
                                  secondaryType={this.props.secondaryType}
                                  codeType={this.props.codeType}
                                  providerType={this.props.providerType}
                                  serviceCode={this.props.serviceCode}
                                  changeCodeType={this.props.changeCodeType} 
                                  changeProviderType={this.props.changeProviderType}/>
              </FormGroup>
          </Col>
          
          <Col md={5}>
            <Button type="submit">Search</Button>
            {"  "}
            <Button>Add Another</Button>
          </Col>
          
          
        </Form>
       
      </div>
    );
  }
}

class RegionSelect extends Component {
  render() {
    return(
      <FormControl componentClass="select" onChange={this.props.changeRegion}>
        <option value="Region 1">Region 1</option>
        <option value="Region 2">Region 2</option>
        <option value="Region 3">Region 3</option>
        <option value="Region 4">Region 4</option>
        <option value="Region 5">Region 5</option>
        <option value="Region 6">Region 6</option>
        <option value="Region 7">Region 7</option>
      </FormControl>
    );
  }
}

class ServiceTypeSelect extends Component {
  render() {
    console.log(this.props.region);
    var servOptions = [];
    // Refactor using .map when possible
    for(var i=0; i<scheduleConfig.schedules.length; i++) {
      servOptions.push(<option key={scheduleConfig.schedules[i].id} value={scheduleConfig.schedules[i].id}>{scheduleConfig.schedules[i].type}</option>);
     }
     
    return(
        <FormControl componentClass="select" onChange={this.props.changeServiceType}>
          <option value="">Select One</option>
          {servOptions}
        </FormControl>
        
    );
  }
}

class SecondaryTypeSelect extends Component {
  
  render() {
    // Get the schedule object with the ID that matches the service type choice
    var id = this.props.serviceType;
    var obj = _.find(scheduleConfig.schedules, { 'id': id});
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
        <FormControl componentClass="select" onChange={this.props.changeSecondaryType}>
          <option value="">Select One</option>
          {secondaryOptions}
        </FormControl>
    );
  }
}

class CodeTypeInput extends Component {
  render() {
    var codeTypes = [];
    var id = this.props.serviceType;
    var secType = this.props.secondaryType;
    
    /// Get the ID of ServiceType/Schedule we start with
    var obj = _.find(scheduleConfig.schedules, {'id': id});
    //// Get the secondary type object based on the chosen type
    obj = _.find(obj.secondaryType, secType);
    console.log(obj);

    //// Get the codeType as a single key in an array 
    obj = _.keys(obj[secType].codeType[0]);
    console.log(obj);
  
    for (var key in obj) {
      codeTypes.push(<option value={obj[key]}>{obj[key]}</option>);
    }
    
    return(
      <FormControl componentClass="select" onChange={this.props.changeCodeType}>
        <option value="">Select One</option>
        {codeTypes}
      </FormControl>
    );
  }
}

class ProviderTypeInput extends Component {
  render() {
    var provTypes = [];
    var id = this.props.serviceType;
    var secType = this.props.secondaryType;
    var cdType = this.props.codeType;
    
    
    ///////LEFT OFF TRYING TO GET TO THE FACILITY TYPE ARRAY
    /// Get the ID of ServiceType/Schedule we start with
    var obj = _.find(scheduleConfig.schedules, {'id': id});
    //// Get the secondary type object based on the chosen type
    obj = _.find(obj.secondaryType, secType);
    console.log(obj);
    
    /// Get the array of facility types attached to the chain
    obj = _.find(obj[secType].codeType[0][cdType]);
    console.log(obj);
    
    for(var i=0; i < obj.length; i++) {
      provTypes.push(<option value={obj[i]}>{obj[i]}</option>);
    }
    
    return(
      <FormControl componentClass="select" onChange={this.props.changeProviderType}>
        <option value="">Select One</option>
        {provTypes}
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
