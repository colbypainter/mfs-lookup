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

// Cannot dynamically create a require(), so must load them then match with the query builder
var schedule1 = require('./hospitalInpatientRehabCMG.json');
var schedule2 = require('./hospitalInpatientAcuteDRGTypeOneHospital.json');
var schedule3 = require('./hospitalInpatientAcuteDRGOtherHospital.json');
var schedule4 = require('./hospitalInpatientRehabDRGTypeOneHospital.json');
var schedule5 = require('./hospitalInpatientRehabDRGOtherHospital.json');
var schedule6 = require('./hospitalInpatientRehabREVENUETypeOneHospital.json');
var schedule7 = require('./hospitalInpatientRehabREVENUEOtherHospital.json');

const schedules = {
  './hospitalInpatientRehabCMG.json': schedule1,
  './hospitalInpatientAcuteDRGTypeOneHospital.json': schedule2,
  './hospitalInpatientAcuteDRGOtherHospital.json': schedule3,
  './hospitalInpatientRehabDRGTypeOneHospital.json': schedule4,
  './hospitalInpatientRehabDRGOtherHospital.json': schedule5,
  './hospitalInpatientRehabREVENUETypeOneHospital.json': schedule6,
  './hospitalInpatientRehabREVENUEOtherHospital.json': schedule7
};

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      serviceType: null,
      secondaryType: null,
      codeType: null,
      providerType: null,
      // Service Code is set to empty string to assist in clearing user input on re-render. 
      serviceCode: "",
      maximumFee: null,
      recentResults: []
    };
    this.changeRegion = this.changeRegion.bind(this);
    this.changeServiceType = this.changeServiceType.bind(this);
    this.changeSecondaryType = this.changeSecondaryType.bind(this);
    this.changeCodeType = this.changeCodeType.bind(this);
    this.changeProviderType = this.changeProviderType.bind(this);
    this.changeServiceCode = this.changeServiceCode.bind(this);
    this.createSchedulePath = this.createSchedulePath.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.querySchedule = this.querySchedule.bind(this);
    this.changeMaximumFee = this.changeMaximumFee.bind(this);
    this.updateRecentResults = this.updateRecentResults.bind(this);
  }
  
  changeRegion(event) { 
    var newRegion = event.target.value;
    this.setState((state, props) => ({
      region: newRegion
    }));
  }
  
  changeServiceType(event) {
    var newServType = event.target.value;
    this.setState((state, props) => ({
      serviceType: newServType,
      secondaryType: null,
      codeType: null,
      providerType: null,
      serviceCode: "",
      maximumFee: null
    }));
  }
  
  changeSecondaryType(event) {
    var newSecType = event.target.value;
    this.setState((state, props) => ({
      secondaryType: newSecType,
      codeType: null,
      providerType: null,
      serviceCode: "",
      maximumFee: null
    }));
  }
  
  changeCodeType(event) {
    var newCodeType = event.target.value;
    this.setState((state, props) => ({
      codeType: newCodeType,
      providerType: null,
      serviceCode: "",
      maximumFee: null
    }));
  }
  
  changeProviderType(event) {
    var newProvType = event.target.value;
    this.setState((state, props) => ({
      providerType: newProvType,
      maximumFee: null
    }));

  }
  
  changeServiceCode(event) {
    var newServiceCode = event.target.value;
    this.setState((state, props) => ({
      serviceCode: newServiceCode
    }));
  }
  
  createSchedulePath() {
    // Get the base schedule ID
    var id = this.state.serviceType;
    var schedule = _.find(scheduleConfig.schedules, { 'id': id});
    
    // Start the path using the basePath of that schedule
    var path = schedule.basePath;
    var stateArray = [this.state.secondaryType, this.state.codeType, this.state.providerType];
    for (var i = 0; i < stateArray.length; i++) {
      if (stateArray[i] !== null) {
        path = path.concat(stateArray[i]);
      }
    }
    // Strip out the spaces
    path = path.replace(/ /g, '');
    path = path.concat('.json');
    path = "./" + path;
    
    this.querySchedule(path, this.state.serviceCode, this.state.region);
    
  }
  
  // Use the path created with createSchedulePath, the region, and the code to find results
  querySchedule(pathname, cd, reg) {
    var table = schedules[pathname];
    var maxValue = table[cd][reg];
    this.changeMaximumFee(maxValue);
  }
  
  changeMaximumFee(fee) {
    var newMaxFee = fee;
    this.setState({
      maximumFee: newMaxFee
    }, function(){
      this.updateRecentResults();
    });
  }
  
  
  handleSubmit(event) {
    this.createSchedulePath();
    event.preventDefault();
  }
  
  updateRecentResults() {
      var results = this.state.recentResults;
      var newResult = {
        region: this.state.region,
        serviceType: this.state.serviceType,
        secondaryType: this.state.secondaryType,
        codeType: this.state.codeType,
        serviceCode: this.state.serviceCode,
        providerType: this.state.providerType,
        maximumFee: this.state.maximumFee
      };
      results.unshift(newResult);
      this.setState((state, props) => ({ 
        recentResults: results
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
                        maximumFee={this.state.maximumFee}
                        changeServiceType={this.changeServiceType}
                        changeRegion={this.changeRegion}
                        changeCodeType={this.changeCodeType} 
                        changeSecondaryType={this.changeSecondaryType}
                        changeServiceCode={this.changeServiceCode}
                        changeProviderType={this.changeProviderType} 
                        handleSubmit={this.handleSubmit}
                        changeMaximumFee={this.changeMaximumFee} 
                        recentResults={this.state.recentResults} 
                        updateRecentResults={this.updateRecentResults} />
          </div>
          <hr />
          <div>
            <Results region={this.state.region} 
                      serviceType={this.state.serviceType}
                      secondaryType={this.state.secondaryType}
                      codeType={this.state.codeType}
                      serviceCode={this.state.serviceCode}
                      providerType={this.state.providerType}
                      maximumFee={this.state.maximumFee}
                      recentResults={this.state.recentResults} 
                      updateRecentResults={this.updateRecentResults} 
                              />
          </div>
          
          <div>
            <RecentResults region={this.state.region} 
                      serviceType={this.state.serviceType}
                      secondaryType={this.state.secondaryType}
                      codeType={this.state.codeType}
                      serviceCode={this.state.serviceCode}
                      providerType={this.state.providerType}
                      maximumFee={this.state.maximumFee} 
                      recentResults={this.state.recentResults} 
                      updateRecentResults={this.updateRecentResults}  />
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
        <h2>Find Your Region</h2>
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
      <div className="FeeLookup">
      <h1>Medical Fee Schedule Lookup</h1>
        <Form>
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Region</ControlLabel>
              <RegionSelect changeRegion={this.props.changeRegion}/>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Fee Schedule - Service Type</ControlLabel>
              <ServiceTypeSelect region={this.props.region} 
                                  serviceType={this.props.serviceType}
                                  secondaryType={this.props.secondaryType}
                                  codeType={this.props.codeType}
                                  providerType={this.props.providerType}
                                  serviceCode={this.props.serviceCode}
                                  maximumFee={this.props.maximumFee}
                                  changeServiceType={this.props.changeServiceType} 
                                  recentResults={this.props.recentResults} 
                                  updateRecentResults={this.props.updateRecentResults} />
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
            <ControlLabel>Secondary Service Type</ControlLabel>
            <SecondaryTypeSelect region={this.props.region} 
                                 serviceType={this.props.serviceType}
                                 secondaryType={this.props.secondaryType}
                                 codeType={this.props.codeType}
                                 providerType={this.props.providerType}
                                 serviceCode={this.props.serviceCode} 
                                 maximumFee={this.props.maximumFee}
                                 changeSecondaryType={this.props.changeSecondaryType} 
                                  recentResults={this.props.recentResults} 
                                  updateRecentResults={this.props.updateRecentResults} />
            </FormGroup>
          </Col>
          
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Code Type</ControlLabel>
              <CodeTypeInput region={this.props.region} 
                  serviceType={this.props.serviceType}
                  secondaryType={this.props.secondaryType}
                  codeType={this.props.codeType}
                  providerType={this.props.providerType}
                  serviceCode={this.props.serviceCode}
                  maximumFee={this.props.maximumFee}
                  changeCodeType={this.props.changeCodeType} 
                  recentResults={this.props.recentResults} 
                  updateRecentResults={this.props.updateRecentResults} />
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <ControlLabel>Code</ControlLabel>
              <ServiceCodeInput changeServiceCode={this.props.changeServiceCode} 
                                serviceCode={this.props.serviceCode}
                                maximumFee={this.props.maximumFee} 
                                  recentResults={this.props.recentResults} 
                                  updateRecentResults={this.props.updateRecentResults} />
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Provider Type</ControlLabel>
              <ProviderTypeInput region={this.props.region} 
                                  serviceType={this.props.serviceType}
                                  secondaryType={this.props.secondaryType}
                                  codeType={this.props.codeType}
                                  providerType={this.props.providerType}
                                  serviceCode={this.props.serviceCode}
                                  maximumFee={this.props.maximumFee}
                                  changeCodeType={this.props.changeCodeType} 
                                  changeProviderType={this.props.changeProviderType} 
                                  recentResults={this.props.recentResults} 
                                  updateRecentResults={this.props.updateRecentResults} />
              </FormGroup>
          </Col>
          
          <Col md={12}>
              <SearchButton handleSubmit={this.props.handleSubmit} maximumFee={this.props.maximumFee}
                                                        changeMaximumFee={this.props.changeMaximumFee} 
                                                        recentResults={this.props.recentResults} 
                                                        updateRecentResults={this.props.updateRecentResults} />
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
        <option value="">Select</option>
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
    var servOptions = [];
    // Refactor using .map when possible
    for(var i=0; i<scheduleConfig.schedules.length; i++) {
      servOptions.push(<option key={scheduleConfig.schedules[i].id} value={scheduleConfig.schedules[i].id}>{scheduleConfig.schedules[i].type}</option>);
     }
     
    return(
        <FormControl componentClass="select" onChange={this.props.changeServiceType}>
          <option value="">Select</option>
          {servOptions}
        </FormControl>
        
    );
  }
}

class SecondaryTypeSelect extends Component {
  
  render() {
    // Get the schedule object with the ID that matches the service type choice
    var id = this.props.serviceType;
    // If the Service Type field is null, render an empty element since we can't populate
    if (id===null) { 
      return(
          <FormControl componentClass="select" onChange={this.props.changeSecondaryType}>
            <option value="">Select</option>
          </FormControl>
      );
    }
    var obj = _.find(scheduleConfig.schedules, { 'id': id});    // Hide the field if it only has one option, which would be null.
    // if (obj.secondaryType.length === 1) {
      // return null;
    // }
    var secondaryOptions = [];
    secondaryOptions.push(<option key="default" value="">Select</option>);
    for(var i=0; i<obj.secondaryType.length; i++) {
      // Iterate through and add to array. Note that for this component desired results are both a key AND value
      _.forEach(obj.secondaryType[i], function(key, opt) {
        // Add a distinct key for each item depending on the chosen options
        secondaryOptions.push(<option key={[id]+[opt]} value={opt}>{opt}</option>);
      });
     }
    
    return(
        <FormControl componentClass="select" onChange={this.props.changeSecondaryType}>
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
    
    // If secondary type is null, render an empty element
    if (secType===null) {
      return(
        <FormControl componentClass="select" onChange={this.props.changeCodeType}>
          <option value="">Select</option>
        </FormControl>
        );
    }
    
    /// Get the ServiceType/Schedule we start with
    var obj = _.find(scheduleConfig.schedules, {'id': id});
    //// Get the secondary type object based on the chosen type
    obj = _.find(obj.secondaryType, secType);

    //// Get the codeType as a single key in an array 
    obj = _.keys(obj[secType].codeType[0]);
    
    
    codeTypes.push(<option key="default" value="">Select</option>);
    _.forEach(obj, function(key, opt) {
        // Make the key unique to prevent the choice from sticking on front-end
        codeTypes.push(<option key={[id]+[secType]+[key]+[opt]} value={key}>{key}</option>);
      });
    
    return(
      <FormControl componentClass="select" onChange={this.props.changeCodeType}>
        {codeTypes}
      </FormControl>
    );
    
  }
}

class ServiceCodeInput extends Component {
  render() {
    return(
      <FormControl type="text" value={this.props.serviceCode} onChange={this.props.changeServiceCode}/>
      );
  }
}

class ProviderTypeInput extends Component {
  render() {
    try {
      var provTypes = [];
      var id = this.props.serviceType;
      var secType = this.props.secondaryType;
      var cdType = this.props.codeType;
      
  
      /// Get the ID of ServiceType/Schedule we start with
      var obj = _.find(scheduleConfig.schedules, {'id': id});
      //// Get the secondary type object based on the chosen type
      obj = _.find(obj.secondaryType, secType);
      
      /// Get the array of facility types attached to the chain
      obj = _.find(obj[secType].codeType[0][cdType]);
      
      provTypes.push(<option key="default" value="">Select</option>);
      /// IF THERE'S A BUG FOUND WITH PROVTYPES, IT PROBABLY HAS TO DO WITH THIS BEING AN ARRAY OF OBJECTS
      _.forEach(obj, function(key, opt) {
        // Make the key unique to prevent the choice from sticking on front-end
        provTypes.push(<option key={[id]+[secType]+[cdType]+[key]+[opt]} value={obj[opt]}>{obj[opt]}</option>);
      });
      
      return(
        <FormControl componentClass="select" onChange={this.props.changeProviderType}>
          {provTypes}
        </FormControl>
        );
    }
    catch(err) {
      console.log(err);
      return(
          <FormControl componentClass="select" onChange={this.props.changeProviderType}>
            <option value="">Select</option>
          </FormControl>
        );
    }
  }
}

class SearchButton extends Component {
  render() {
    return (
      <Button type="button" onClick={this.props.handleSubmit}  >
                                                        Search</Button>
      );
  }
}

class Results extends Component {
  
  render() {
    return (
      <div>
      <Col md={12}>
        <h3>Search Results</h3>
        <Table bordered striped>
          <thead>
            <tr>
              <th>Code ({this.props.codeType})</th>
              <th>Region</th>
              <th>Fee Schedule</th>
              <th>Maximum Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.serviceCode}</td>
              <td>{this.props.region}</td>
              <td>{this.props.serviceType + "-" + this.props.secondaryType + "-" + this.props.providerType}</td>
              <td>{this.props.maximumFee}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      </div>
    );
  }
}

class RecentResults extends Component {
  render() {
    var recentResults = this.props.recentResults;
    if (recentResults.length === 0) {
      return null;
    }
    var resultsRows = [];
    for(var i=0; i < (recentResults.length); i++) {
      resultsRows.push(
        <Table bordered striped>
            <thead>
              <tr>
                <th>Code ({recentResults[i].codeType})</th>
                <th>Region</th>
                <th>Fee Schedule</th>
                <th>Maximum Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{recentResults[i].serviceCode}</td>
                <td>{recentResults[i].region}</td>
                <td>{recentResults[i].serviceType + "-" + recentResults[i].secondaryType + "-" + recentResults[i].providerType}</td>
                <td>{recentResults[i].maximumFee}</td>
              </tr>
            </tbody>
          </Table>
        );
    }
    resultsRows.reverse;
    
    return (
      <div>
        <h3>Recent Searches</h3>
        {resultsRows}
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
