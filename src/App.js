import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col, Navbar, Jumbotron, ListGroup, ListGroupItem, 
        Button, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table, Panel } from 'react-bootstrap';

var _ = require('lodash');

var zipMap = require('./zipMap.json');
console.log(zipMap);
        
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
var schedule8 = require('./hospitalOutpatientCPTTypeOneHospital.json');
var schedule9 = require('./hospitalOutpatientCPTOtherHospital.json');
var schedule10 = require('./hospitalOutpatientHCPCSTypeOneHospital.json');
var schedule11 = require('./hospitalOutpatientHCPCSOtherHospital.json');
var schedule12 = require('./hospitalOutpatientREVENUETypeOneHospital.json');
var schedule13 = require('./hospitalOutpatientREVENUEOtherHospital.json');
var schedule14 = require('./hospitalOutpatientREVENUECPTTypeOneHospital.json');
var schedule15 = require('./hospitalOutpatientREVENUECPTOtherHospital.json');
var schedule16 = require('./hospitalOutpatientREVENUEHCPCSTypeOneHospital.json');
var schedule17 = require('./hospitalOutpatientREVENUEHCPCSOtherHospital.json');
var schedule18 = require('./ascCPT.json');
var schedule19 = require('./ascREVENUE.json');
var schedule20 = require('./profAnesthesiaCPT.json');


const schedules = {
  './hospitalInpatientRehabCMG.json': schedule1,
  './hospitalInpatientAcuteDRGTypeOneHospital.json': schedule2,
  './hospitalInpatientAcuteDRGOtherHospital.json': schedule3,
  './hospitalInpatientRehabDRGTypeOneHospital.json': schedule4,
  './hospitalInpatientRehabDRGOtherHospital.json': schedule5,
  './hospitalInpatientRehabREVENUETypeOneHospital.json': schedule6,
  './hospitalInpatientRehabREVENUEOtherHospital.json': schedule7,
  './hospitalOutpatientCPTTypeOneHospital.json': schedule8,
  './hospitalOutpatientCPTOtherHospital.json': schedule9,
  './hospitalOutpatientHCPCSTypeOneHospital.json': schedule10,
  './hospitalOutpatientHCPCSOtherHospital.json': schedule11,
  './hospitalOutpatientREVENUETypeOneHospital.json': schedule12,
  './hospitalOutpatientREVENUEOtherHospital.json': schedule13,
  './hospitalOutpatientREVENUECPTTypeOneHospital.json': schedule14,
  './hospitalOutpatientREVENUECPTOtherHospital.json': schedule15,
  './hospitalOutpatientREVENUEHCPCSTypeOneHospital.json': schedule16,
  './hospitalOutpatientREVENUEHCPCSOtherHospital.json': schedule17,
  './ascCPT.json': schedule18,
  './ascREVENUE.json': schedule19,
  './profAnesthesiaCPT.json': schedule20
};

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      // serviceType is currently the ID of the schedule. Name should be changed to scheduleID
      serviceType: null,
      secondaryType: null,
      codeType: null,
      providerType: null,
      // Service Code is set to empty string to assist in clearing user input on re-render. 
      serviceCode: "",
      modifier: null,
      modifierValue: null,
      baseUnits: null,
      maximumFee: null,
      recentResults: []
    };
    this.changeRegion = this.changeRegion.bind(this);
    this.changeServiceType = this.changeServiceType.bind(this);
    this.changeSecondaryType = this.changeSecondaryType.bind(this);
    this.changeCodeType = this.changeCodeType.bind(this);
    this.changeProviderType = this.changeProviderType.bind(this);
    this.changeServiceCode = this.changeServiceCode.bind(this);
    this.changeModifier = this.changeModifier.bind(this);
    this.createSchedulePath = this.createSchedulePath.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.querySchedule = this.querySchedule.bind(this);
    this.changeBaseUnits = this.changeBaseUnits.bind(this);
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
      secondaryType: "null",
      codeType: null,
      modifier: null,
      modifierValue: null,
      baseUnits: null,
      providerType: null,
      serviceCode: "",
      maximumFee: null
    }));
  }
  
  // For when users choose a type
  changeSecondaryType(event) {
    var newSecType = event.target.value;
    this.setState((state, props) => ({
      secondaryType: newSecType,
      codeType: null,
      modifier: null,
      modifierValue: null,
      baseUnits: null,
      providerType: null,
      serviceCode: "",
      maximumFee: null
    }));
  }
  

  
  changeCodeType(event) {
    var newCodeType = event.target.value;
    this.setState((state, props) => ({
      codeType: newCodeType,
      modifier: null,
      modifierValue: null,
      baseUnits: null,
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
  
  changeModifier(event) {
    var newModifier = event.target.value;
    if(_.includes(["P1", "P2", "P3", "P4", "P5", "P6"], newModifier)) {
      var newModifierValue = scheduleConfig.modifierKey[newModifier];
      console.log("testing modifier value: " + newModifierValue);
    }
    this.setState((state, props) => ({
      modifier: newModifier,
      modifierValue: newModifierValue
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
      if (stateArray[i] !== 'null' && stateArray[i] !== null) {
        path = path.concat(stateArray[i]);
      }
    }
    // Strip out the spaces
    path = path.replace(/ /g, '');
    path = path.concat('.json');
    path = "./" + path;
    // Strip + from the path
    path = path.replace(/\+/g, "");
    console.log(path);
    this.querySchedule(path, this.state.serviceCode, this.state.region);
    
  }
  
  // Use the path created with createSchedulePath, the region, and the code to find results
  querySchedule(pathname, cd, reg) {
    
    if(this.state.modifier !== null && this.state.modifier !== 'null' && !(_.includes(["P1", "P2", "P3", "P4", "P5", "P6"], this.state.modifier))) {
      cd = cd + this.state.modifier;
    }
    
    var table = schedules[pathname];
    console.log("Before query, code is: " + cd + " and region is: " + reg);
    var maxValue = _.get(table, [cd, reg], "Not Found");
    var baseUnits = _.get(table, [cd, "Base Units"], "Not Found");
    console.log("Testing base units: " + baseUnits);
    this.changeBaseUnits(baseUnits);
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
  
  changeBaseUnits(baseUnits) {
    var newBaseUnits = baseUnits;
    this.setState({
      baseUnits: newBaseUnits
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
        modifier: this.state.modifier,
        baseUnits: this.state.baseUnits,
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
            <ZipLookup findRegion={this.findRegion} />
          </div>
          <hr />
          <div>
            <LookupForm region={this.state.region} 
                        serviceType={this.state.serviceType}
                        secondaryType={this.state.secondaryType}
                        codeType={this.state.codeType}
                        serviceCode={this.state.serviceCode}
                        modifier={this.state.modifier}
                        providerType={this.state.providerType}
                        maximumFee={this.state.maximumFee}
                        changeServiceType={this.changeServiceType}
                        changeRegion={this.changeRegion}
                        changeCodeType={this.changeCodeType} 
                        changeSecondaryType={this.changeSecondaryType}
                        changeServiceCode={this.changeServiceCode}
                        changeModifier={this.changeModifier}
                        changeProviderType={this.changeProviderType} 
                        handleSubmit={this.handleSubmit}
                        changeMaximumFee={this.changeMaximumFee} 
                        recentResults={this.state.recentResults} 
                        updateRecentResults={this.updateRecentResults} />
          </div>

          <hr />
          <div>
            <RecentResults region={this.state.region} 
                      serviceType={this.state.serviceType}
                      secondaryType={this.state.secondaryType}
                      codeType={this.state.codeType}
                      serviceCode={this.state.serviceCode}
                      modifier={this.state.modifier}
                      providerType={this.state.providerType}
                      maximumFee={this.state.maximumFee} 
                      recentResults={this.state.recentResults} 
                      updateRecentResults={this.updateRecentResults}  />
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

    constructor(props) {
        super(props);  
        this.state = {
          zip: null,
          region: null,
          message: null
        };
        this.changeZip = this.changeZip.bind(this);
        this.findRegion = this.findRegion.bind(this);
      }
      
      changeZip(event) {
        var zipInput = event.target.value;
        zipInput = zipInput.substring(0, 3);
        console.log(zipInput);
        this.setState((state, props) => ({
          zip: zipInput,
          message: null
        }));
      }
      
      findRegion(event) { 
        var newRegion = _.get(zipMap, this.state.zip);
        console.log(newRegion);
        this.setState((state, props) => ({
          region: newRegion,
          message: true
        }));
      }
      
      render() {
        return (
          <Panel className="ZipLookup" header="Find Your Region" bsStyle="primary">
              <Form inline>
                <FormGroup>
                    <h5>Enter the <strong>first three digits</strong> of the zip code for the location of service.</h5>
                    <ControlLabel>Zip Code</ControlLabel>
                    {"   "}
                    <ZipInput zip={this.state.zip} changeZip={this.changeZip} />
                    {"   "}
                    <ZipSubmitButton zip={this.state.zip} findRegion={this.findRegion} />
                </FormGroup>
                <ZipMessage region={this.state.region} message={this.state.message} zip={this.state.zip}/>
              </Form>
          </Panel>
        );
      }
  }
  
class ZipInput extends Component {
  render() {
    return (
      <FormControl type="text" id="zip_input" placeholder="###" onChange={this.props.changeZip} />
    );
  }
}


class ZipSubmitButton extends Component {
  render() {
    return (
      <Button bsStyle="primary" type="button" onClick={this.props.findRegion} zip={this.props.zip}  >
                                                        Search</Button>
      );
  }
}

class ZipMessage extends Component {
  render() {
    if(this.props.message == null) { 
      return(null); 
    } else if(this.props.region === undefined && this.props.message === true) {
      return (
      <Alert className="zip-alert" bsStyle="danger">
        Region not found.
      </Alert>
      );
    } else {
      return (
      <Alert className="zip-alert" bsStyle="success">
        Zip {this.props.zip}xxx is : <strong>{this.props.region}</strong>
      </Alert>
      );
    }
  }
}

class LookupForm extends Component {
  
  render() {
    return (
      <Panel className="FeeLookup" header="Medical Fee Schedule Lookup" bsStyle="primary">
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
          
          <Col md={2}>
            <FormGroup>
              <ServiceCodeLabel codeType={this.props.codeType}/>
              <ServiceCodeInput changeServiceCode={this.props.changeServiceCode}
                                codeType={this.props.codeType}
                                serviceCode={this.props.serviceCode}
                                maximumFee={this.props.maximumFee} 
                                  recentResults={this.props.recentResults} 
                                  updateRecentResults={this.props.updateRecentResults} />
            </FormGroup>
          </Col>
          
          <Col md={2}>
              <ModifierInput serviceType={this.props.serviceType} 
                              secondaryType={this.props.secondaryType} 
                              codeType={this.props.codeType}
                              serviceCode={this.props.serviceCode}
                              changeModifier={this.props.changeModifier} 
                              modifier={this.props.modifier} />
          </Col>
          
          <Col md={6}>
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
                          
          </Col>
          
          <Col md={12}>
              <SearchButton handleSubmit={this.props.handleSubmit} maximumFee={this.props.maximumFee}
                                                        changeMaximumFee={this.props.changeMaximumFee} 
                                                        recentResults={this.props.recentResults} 
                                                        updateRecentResults={this.props.updateRecentResults} />
          </Col>
          
        </Form>
          <Col md={12}>
            <Results region={this.props.region} 
                      serviceType={this.props.serviceType}
                      secondaryType={this.props.secondaryType}
                      codeType={this.props.codeType}
                      serviceCode={this.props.serviceCode}
                      modifier={this.props.modifier}
                      providerType={this.props.providerType}
                      maximumFee={this.props.maximumFee}
                      recentResults={this.props.recentResults} 
                      updateRecentResults={this.updateRecentResults} 
                              />
          </Col>
      </Panel>
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
    try {
      // Get the schedule object with the ID that matches the service type choice
      var id = this.props.serviceType;
      var obj = _.find(scheduleConfig.schedules, { 'id': id});
      console.log(obj);

      var secondaryOptions = [];
      secondaryOptions.push(<option key="default" value="">Select</option>);
      for(var i=0; i<obj.secondaryType.length; i++) {
        // Iterate through and add to array. Note that for this component desired results are both a key AND value
        _.forEach(obj.secondaryType[i], function(key, opt) {
          // Add a distinct key for each item depending on the chosen options
          secondaryOptions.push(<option key={[id]+[opt]} value={opt}>{opt}</option>);
        });
       }
      
      // If the only content of the array is the default option AND the null key, don't display
      if (secondaryOptions.length === 2) {
        return(null);
      } else {
        // If the array has contents, it is valid to display
        return(
          <FormGroup>
            <ControlLabel>Secondary Service Type</ControlLabel>
            <FormControl componentClass="select" onChange={this.props.changeSecondaryType}>
              {secondaryOptions}
            </FormControl>
          </FormGroup>
        );
      }
    }
    catch(err) {
      console.log(err);
      return(null);
    }
  }
}

class CodeTypeInput extends Component {
  render() {
    try {
      var codeTypes = [];
      var id = this.props.serviceType;
      var secType = this.props.secondaryType;
      
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
    catch(err) {
      console.log(err);
      return(
        <FormControl componentClass="select" disabled>
          <option value="">Select</option>
        </FormControl>
        );
    }
  }
}

class ServiceCodeLabel extends Component {
  render() {
    var codeType = this.props.codeType;
    if (codeType == "REVENUE+CPT") {
      codeType = "CPT";
    }
    if (codeType == "REVENUE+HCPCS") {
      codeType = "HCPCS";
    }
    return(
      <ControlLabel>{codeType} Code</ControlLabel>
      );
  }
}

class ServiceCodeInput extends Component {
  render() {
    var codeType = this.props.codeType;
    if (codeType === null) {
      return(
        <FormControl type="text" disabled/>
        );
    }
    return(
      <FormControl type="text" value={this.props.serviceCode} onChange={this.props.changeServiceCode}/>
      );
  }
}

class ModifierInput extends Component {
  render() {
    try {
      var modArray = [];

      var id = this.props.serviceType;
      var secType = this.props.secondaryType;
      var cdType = this.props.codeType;
      
      /// Get the ID of ServiceType/Schedule we start with
      var obj = _.find(scheduleConfig.schedules, {'id': id});
      //// Get the secondary type object based on the chosen type
      obj = _.find(obj.secondaryType, secType);
      /// Get the array of modifiers attached to the chain
      obj = _.filter(obj[secType].codeType[0][cdType].modifiers);
      
      if (obj.length === 0) {
        return(null);
      }
      
      modArray.push(<option key="default" value="">Select</option>);
      console.log(obj);
      _.forEach(obj, function(key, opt) {
        // Make the key unique to prevent the choice from sticking on front-end
        modArray.push(<option key={[id]+[secType]+[cdType]+[key]+[opt]} value={obj[opt]}>{obj[opt]}</option>);
      });
      
      return(
        <FormGroup>
          <ControlLabel>Modifier</ControlLabel>
          <FormControl componentClass="select" onChange={this.props.changeModifier}>
            {modArray}
          </FormControl>
        </FormGroup>
        );
    }
    catch(err) {
      console.log(err);
      return(null);
    }
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
      /// If problems arise with this, try _.filter instead of _.find
      obj = _.find(obj[secType].codeType[0][cdType]);
      console.log(obj);
      
      provTypes.push(<option key="default" value="">Select</option>);
      /// IF THERE'S A BUG FOUND WITH PROVTYPES, IT PROBABLY HAS TO DO WITH THIS BEING AN ARRAY OF OBJECTS
      _.forEach(obj, function(key, opt) {
        // Make the key unique to prevent the choice from sticking on front-end
        provTypes.push(<option key={[id]+[secType]+[cdType]+[key]+[opt]} value={obj[opt]}>{obj[opt]}</option>);
      });
      
      // If the only contents of the provTypes array is the default option we fed to it, don't render
      if (provTypes.length === 1) {
        return(
          null
          );
      } else {
        // If the array has contents, it is valid to display
        return(
          <FormGroup>
            <ControlLabel>Provider Type</ControlLabel>
              <FormControl componentClass="select" onChange={this.props.changeProviderType}>
                {provTypes}
              </FormControl>
          </FormGroup>
          );
        }
      }
    catch(err) {
      console.log(err);
      // This catches, among other things, when the upstream inputs are still null also
      return(
          null
        );
    }
  }
}

class SearchButton extends Component {
  render() {
    return (
      <Button bsStyle="primary" type="button" onClick={this.props.handleSubmit}  >
                                                        Search</Button>
      );
  }
}

class Results extends Component {
  
  render() {
    if(this.props.maximumFee == null) {
      return null;
    }
    return (
      <Panel header="Search Results" className="results-panel" bsStyle="success">
      
        <Table bordered fill>
          <thead>
            <tr>
              <th>Maximum Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.maximumFee}</td>
            </tr>
          </tbody>
        </Table>
      
      </Panel>
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
      
      // Since state currently only holds the ID, we need to fetch the schedule description for display
      var id = recentResults[i].serviceType;
      var schedule = _.find(scheduleConfig.schedules, { 'id': id});
      
      var feeSchedule = schedule.type;
      console.log(feeSchedule);
      
      if (recentResults[i].secondaryType !== 'null') { 
        feeSchedule = feeSchedule + ", " + recentResults[i].secondaryType;
      }
      
      if (recentResults[i].providerType !== null) { 
        feeSchedule = feeSchedule + ", " + recentResults[i].providerType;
      }
      
      resultsRows.push(

              <tr>
                <td>
                <strong>Fee Schedule:</strong> {feeSchedule}<br/>
                <strong>Region:</strong> {recentResults[i].region}<br/>
                <strong>Code</strong> {"(" + recentResults[i].codeType + "):"} {" "} {recentResults[i].serviceCode}<br/>
                <strong>Modifier:</strong> {recentResults[i].modifier}</td>
                
                <td>
                <strong>Base Units:</strong> {recentResults[i].baseUnits}<br/>
                <strong>Maximum Fee:</strong> {recentResults[i].maximumFee}</td>
              </tr>

        );
    }
    resultsRows.reverse;
    
    return (
      <Panel header="Recent Searches" bsStyle="info">
        <Table bordered striped fill>
          <thead>
            <tr>
              <th className="col-sm-8">Search Terms</th>
              
              <th className="col-sm-4">Results</th>

            </tr>
          </thead>
          <tbody>
            {resultsRows}
          </tbody>
         </Table>
      </Panel>
      );
  }
}

// Accept array of terms from results table and query MfsTerms.json
class MfsKey extends Component {
  render() {
    return (
        <div className="mfs-key">
          <h3>Terms and Information</h3>
          <ListGroup>
            <ListGroupItem header="Type One Teaching Hospital">This is a good place to define terms or concepts.</ListGroupItem>
            <ListGroupItem header="Modifier 26">This is too.</ListGroupItem>
          </ListGroup>
        </div>
      );
  }
}

export default App;
