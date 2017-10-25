import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo100x100.png';
import './App.css';
import { Grid, Row, Col, Nav, NavItem, NavDropdown, MenuItem, Navbar, Jumbotron, ListGroup, ListGroupItem, 
        Button, Checkbox, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table, Panel } from 'react-bootstrap/lib';


var _ = require('lodash');
// Load the zipcode-region mapping file
var zipMap = require('./zipMap.json');
// Load the By Report Codes for all BR results
var byReportCodes = require('./byReportCodes.json');
// Load the configuration file that determines what options present for each schedule
var scheduleConfig = require('./scheduleConfig.json');

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
var schedule21 = require('./profAllOtherServicesCPTSurgeon.json');
var schedule22 = require('./profAllOtherServicesCPTNon-Surgeon.json');
var schedule23 = require('./profAllOtherServicesHCPCSSurgeon.json');
var schedule24 = require('./profAllOtherServicesHCPCSNon-Surgeon.json');
var schedule25 = require('./profInjectableDrugsCPT.json');
var schedule26 = require('./profInjectableDrugsHCPCS.json');
var schedule27 = require('./physMedRehabServicesCPT.json');
var schedule28 = require('./physMedRehabServicesHCPCS.json');
var schedule29 = require('./osteoChiroCPT.json');
var schedule30 = require('./acupunctureCPT.json');
var schedule31 = require('./dentalHCPCS.json');
var schedule32 = require('./ambulanceHCPCS.json');
var schedule33 = require('./scodesHCPCS.json');
var schedule34 = require('./profInjectableDrugsHCPCSJ-Code.json');
var schedule35 = require('./hospitalOutpatientHCPCSJ-CodeTypeOneHospital.json');
var schedule36 = require('./hospitalOutpatientHCPCSJ-CodeOtherHospital.json');

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
  './profAnesthesiaCPT.json': schedule20,
  './profAllOtherServicesCPTSurgeon.json': schedule21,
  './profAllOtherServicesCPTNon-Surgeon.json': schedule22,
  './profAllOtherServicesHCPCSSurgeon.json': schedule23,
  './profAllOtherServicesHCPCSNon-Surgeon.json': schedule24,
  './profInjectableDrugsCPT.json': schedule25,
  './profInjectableDrugsHCPCS.json': schedule26,
  './physMedRehabServicesCPT.json': schedule27,
  './physMedRehabServicesHCPCS.json': schedule28,
  './osteoChiroCPT.json': schedule29,
  './acupunctureCPT.json': schedule30,
  './dentalHCPCS.json': schedule31,
  './ambulanceHCPCS.json': schedule32,
  './scodesHCPCS.json': schedule33,
  './profInjectableDrugsHCPCSJ-Code.json': schedule34,
  './hospitalOutpatientHCPCSJ-CodeTypeOneHospital.json': schedule35,
  './hospitalOutpatientHCPCSJ-CodeOtherHospital.json': schedule36
};

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      // Note: serviceType currently gets set to the ID of the schedule, not the Name
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
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
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
    this.handleSearch = this.handleSearch.bind(this);
    this.querySchedule = this.querySchedule.bind(this);
    this.changeBaseUnits = this.changeBaseUnits.bind(this);
    this.changeMultiSurgApplies = this.changeMultiSurgApplies.bind(this);
    this.changeBilatSurgApplies = this.changeBilatSurgApplies.bind(this);
    this.changePer = this.changePer.bind(this);
    this.changeMaximumFee = this.changeMaximumFee.bind(this);
    this.updateRecentResults = this.updateRecentResults.bind(this);
  }
  
  changeRegion(event) { 
    var newRegion = event.target.value;
    this.setState((state, props) => ({
      region: newRegion,
      per: null,
      maximumFee: null
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
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
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
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
      maximumFee: null
    }));
  }
  

  
  changeCodeType(event) {
    var newCodeType = event.target.value;
    var newServiceCode = "";
    if (newCodeType === "HCPCS J-Code") {
      newServiceCode = "JCODE";
      console.log("testing jcode in changeCodeType");
    }
    this.setState((state, props) => ({
      codeType: newCodeType,
      modifier: null,
      modifierValue: null,
      baseUnits: null,
      providerType: null,
      serviceCode: newServiceCode,
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
      maximumFee: null
    }));
  }
  
  changeProviderType(event) {
    var newProvType = event.target.value;
    this.setState((state, props) => ({
      providerType: newProvType,
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
      maximumFee: null
    }));

  }
  
  changeServiceCode(event) {
    var newServiceCode = event.target.value;
    this.setState((state, props) => ({
      serviceCode: newServiceCode,
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
      maximumFee: null
    }));
  }
  
  changeModifier(event) {
    var newModifier = event.target.value;
    if(_.includes(["P1", "P2", "P3", "P4", "P5", "P6"], newModifier)) {
      var newModifierValue = scheduleConfig.modifierKey[newModifier];
    }
    this.setState((state, props) => ({
      modifier: newModifier,
      modifierValue: newModifierValue,
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
      maximumFee: null
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
    var maxValue = _.get(table, [cd, reg], "Not Found");
    
    // If the code is BR, it must refer back to the percentage assigned to that schedule, as defined in byReportCodes.json 
    // FUTURE REFACTOR: There is redundancy in the code here and createSchedulePath, because the base path isn't stored in state. 
   if(maxValue == 'BR') {
     let id = this.state.serviceType;
     let schedule = _.find(scheduleConfig.schedules, { 'id': id});
     let basePath = schedule.basePath;
     // Hospital Outpatient BR codes are dependent on the provider type, so we have to append that to the base path
     if(basePath == 'hospitalOutpatient') { 
      basePath = basePath + this.state.providerType;
      // Strip out the spaces
      basePath = basePath.replace(/ /g, '');
     }
     let brCode = _.get(byReportCodes, [basePath, reg], "Not Found");
     maxValue = "By Report - " + brCode;
   }

     
    var baseUnits = _.get(table, [cd, "Base Units"], "Not Found");
    var multiSurg = _.get(table, [cd, "Mult Surg Adjustment Applies"], "N/A");
    var bilatSurg = _.get(table, [cd, "Bilat Surg Adjustment Applies"], "N/A");
    var per = _.get(table, [cd, "Per"], "");
    this.changeBaseUnits(baseUnits);
    this.changeMaximumFee(maxValue);
    this.changeMultiSurgApplies(multiSurg);
    this.changeBilatSurgApplies(bilatSurg);
    this.changePer(per);
  }
  
  // updateRecentResults must be executed after maximum fee has updated in state, so here it's a callback in setState
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
  
  changeMultiSurgApplies(applies) {
    var newMultiSurgApplies = applies;
    this.setState({
      multiSurgApplies: newMultiSurgApplies
    });
  }
  
  changeBilatSurgApplies(applies) {
    var newBilatSurgApplies = applies;
    this.setState({
      bilatSurgApplies: newBilatSurgApplies
    });
  }
  
  changePer(perValue) { 
    var newPer = perValue;
    this.setState({
      per: newPer
    });
  }
  
  handleSearch(event) {
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
        modifierValue: this.state.modifierValue,
        modifier: this.state.modifier,
        baseUnits: this.state.baseUnits,
        multiSurgApplies: this.state.multiSurgApplies,
        bilatSurgApplies: this.state.bilatSurgApplies,
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
        <div id="App-header">
          <Header />
        </div>
        <div className="container app-content">
          <div>
            <WelcomeContent />
          </div>
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
                        modifierValue={this.state.modifierValue}
                        baseUnits={this.state.baseUnits}
                        providerType={this.state.providerType}
                        maximumFee={this.state.maximumFee}
                        multiSurgApplies={this.state.multiSurgApplies}
                        bilatSurgApplies={this.state.bilatSurgApplies}
                        per={this.state.per}

                        changeServiceType={this.changeServiceType}
                        changeRegion={this.changeRegion}
                        changeCodeType={this.changeCodeType} 
                        changeSecondaryType={this.changeSecondaryType}
                        changeServiceCode={this.changeServiceCode}
                        changeModifier={this.changeModifier}
                        changeProviderType={this.changeProviderType} 
                        handleSearch={this.handleSearch}
                        changeMaximumFee={this.changeMaximumFee}
                        changeMultiSurgApplies={this.changeMultiSurgApplies}
                        changeBilatSurgApplies={this.changeBilatSurgApplies}
                        changePer={this.changePer}
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
                      multiSurgApplies={this.state.multiSurgApplies}
                      bilatSurgApplies={this.state.bilatSurgApplies}
                      per={this.state.per}
                      recentResults={this.state.recentResults} 
                      updateRecentResults={this.updateRecentResults}  />
          </div>
          
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <Navbar staticTop >
        <Grid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="http://www.workcomp.virginia.gov/">VWC Website</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">Ground Rules</NavItem>
              <NavItem eventKey={2} href="#">Fee Schedule</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Grid>
      </Navbar>
    );
  }
}

class WelcomeContent extends Component {
  render() {
    return (
      <div>
        <Panel className="app-title">
          <img src={logo} alt="VWC Logo" />
          <h2>Medical Fee Schedule</h2>
          <h4>Reference Tools</h4>
        </Panel>
        <Panel className="MfsPanels welcome-panel">
          <p>Effective for all dates of service on or after January 1, 2018, medical fees will be subject to VWC's Medical Fee Schedule.</p>
          <p>Use the tools below to find out your regional classification or determine your maximum rate of payment.</p>
          <p>Want to know more about the Fee Schedule? Please refer to our <a href="">Ground Rules</a> documentation or view the <a href="">Fee Schedule</a> itself.</p>
        </Panel>
      </div>
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
          <Panel className="MfsPanels ZipLookup" header="Find Your Region">
            <Col>
             <h4>Enter the <strong>first three digits</strong> of the zip code for the location of service.</h4>
            </Col>
            <hr/>
              <Form inline>
                <Col xs={12} >
                  <FormGroup>
                      <ControlLabel>Zip Code</ControlLabel>
                      {"   "}
                      <ZipInput zip={this.state.zip} changeZip={this.changeZip} />
                  </FormGroup>
                  {"   "}
                      <ZipSearchButton zip={this.state.zip} findRegion={this.findRegion} />
                </Col>
              </Form>
            <Col xs={8} xsOffset={2} className="zip-result">
              
              <ZipMessage region={this.state.region} message={this.state.message} zip={this.state.zip}/>
            </Col>
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


class ZipSearchButton extends Component {
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
      return(
        <Panel className="results-panel MfsPanels" >
        
          <Table bordered fill>
            <thead>
              <tr>
                <th>Search Results</th>
                <th><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Region</th>
                <td>Not Found</td>
              </tr>
            </tbody>
          </Table>
        
        </Panel>
        );
    } else {
    return (
      <Panel className="results-panel MfsPanels" >
      
        <Table bordered fill>
          <thead>
            <tr>
              <th>Search Results</th>
              <th><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Region</th>
              <td>{this.props.region}</td>
            </tr>
          </tbody>
        </Table>
      
      </Panel>
      );
    } 
  }
}

class LookupForm extends Component {
  
  render() {
    return (
      <Panel className="MfsPanels FeeLookup" header="Maximum Rate Search">
        <Form>
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Region*</ControlLabel>
              <RegionSelect changeRegion={this.props.changeRegion}/>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Fee Schedule - Service Type*</ControlLabel>
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
          
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Code Type*</ControlLabel>
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
                          
          
          
          <Col md={2}>
              <ModifierInput serviceType={this.props.serviceType} 
                              secondaryType={this.props.secondaryType} 
                              codeType={this.props.codeType}
                              serviceCode={this.props.serviceCode}
                              changeModifier={this.props.changeModifier} 
                              modifier={this.props.modifier} />
                              
          </Col>
          

          
          <Col md={12}>
              <SearchButton handleSearch={this.props.handleSearch} maximumFee={this.props.maximumFee}
                                                        multiSurgApplies={this.props.multiSurgApplies}
                                                        bilatSurgApplies={this.props.bilatSurgApplies}
                                                        per={this.props.per}
                                                        changeMaximumFee={this.props.changeMaximumFee} 
                                                        changeMultiSurgApplies={this.props.changeMultiSurgApplies}
                                                        changeBilatSurgApplies={this.props.changeBilatSurgApplies}
                                                        changePer={this.props.changePer}
                                                        recentResults={this.props.recentResults} 
                                                        updateRecentResults={this.props.updateRecentResults} />
          <hr />
          </Col>
          
        </Form>
          
          <Col xs={10} xsOffset={1} >
            <Results region={this.props.region} 
                      serviceType={this.props.serviceType}
                      secondaryType={this.props.secondaryType}
                      codeType={this.props.codeType}
                      serviceCode={this.props.serviceCode}
                      modifier={this.props.modifier}
                      modifierValue={this.props.modifierValue}
                      baseUnits={this.props.baseUnits}
                      providerType={this.props.providerType}
                      multiSurgApplies={this.props.multiSurgApplies}
                      bilatSurgApplies={this.props.bilatSurgApplies}
                      per={this.props.per}
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
            <ControlLabel>Secondary Service Type*</ControlLabel>
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
    if (codeType == "REVENUE") {
      codeType = "Revenue";
    }
    if (codeType == "HCPCS J-Code") {
      codeType = "";
      console.log("testing jcode");
    }
    
    return(
      <ControlLabel>{codeType} Code*</ControlLabel>
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
    } else if(codeType == "HCPCS J-Code") {
      return(
        <FormControl type="text" value="JCODE" readOnly/>
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
      /// Get the array of modifiers
      obj = _.filter(obj[secType].codeType[0][cdType].modifiers);
      
      if (obj.length === 0) {
        return(null);
      } else {
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
      
      /// Get the array of facility types 
      obj = _.find(obj[secType].codeType[0][cdType]);
      console.log(obj);
      
      provTypes.push(<option key="default" value="">Select</option>);
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
          <Col md={5}>
            <FormGroup>
              <ControlLabel>Provider Type*</ControlLabel>
                <FormControl componentClass="select" onChange={this.props.changeProviderType}>
                  {provTypes}
                </FormControl>
            </FormGroup>
          </Col>
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
      <Button bsStyle="primary" type="button" onClick={this.props.handleSearch}  >
                                                        Search</Button>
      );
  }
}

class Results extends Component {
  
  render() {
    if(this.props.maximumFee == null) {
      return null;
    }
    var resultsIndicator = null;
    if(this.props.maximumFee === "Not Found") {
      resultsIndicator = 
      <th><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></th>;
    } else {
      resultsIndicator = <th><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></th>;
    }
    
    var messageRow = null;
    var maxFeeRow = null;
    var baseUnitsRow = null;
    var conversionRateRow = null;
    var PSUModifierRow = null;
    console.log("secondary service type is: " + this.props.secondaryType);
    // TODO consider whether to display these if they do not apply to that schedule
    var multiSurgRow = <tr><td>Multi-Surgery Reduction Applies</td><td>{this.props.multiSurgApplies}</td></tr>;
    var bilatSurgRow = <tr><td>Bilateral Surgery Reduction Applies</td><td>{this.props.bilatSurgApplies}</td></tr>;
    
    var isQualifyingCircumstance = false;
    if(this.props.secondaryType === "Anesthesia" && _.includes(["99100", "99116", "99135", "99140"], this.props.serviceCode)) {
      messageRow = <tr><td><strong>Please Note: </strong>This code is a Qualifying Circumstance, and must be reported in addition to the primary anesthesia procedure code.</td></tr>;
      isQualifyingCircumstance = true;
    }
    
    if(this.props.secondaryType === "Anesthesia" && this.props.maximumFee !== "Not Found" && isQualifyingCircumstance == false) {
      baseUnitsRow = <tr><td>Base Units</td><td>{this.props.baseUnits}</td></tr>;
      conversionRateRow = <tr><td>Conversion Rate</td><td>{this.props.maximumFee}</td></tr>;
      PSUModifierRow = <tr><td>Physical Status Units</td><td>{this.props.modifierValue}</td></tr>;
      maxFeeRow = <tr><td>Maximum Fee</td><td>= {this.props.maximumFee} x ({this.props.baseUnits} + {this.props.modifierValue} + TIME UNITS)</td></tr>;
      
    } else {
      maxFeeRow = <tr><td>Maximum Fee</td><td>{this.props.maximumFee}{" " + this.props.per}</td></tr>;
    }
    
    return(
      <Panel className="results-panel MfsPanels" >
      
        <Table bordered fill>
          <thead>
            <tr>
              <th>Search Results</th>
              {resultsIndicator}
            </tr>
          </thead>
          <tbody>
              {conversionRateRow}
              {baseUnitsRow}
              {PSUModifierRow}
              {maxFeeRow}
              {multiSurgRow}
              {bilatSurgRow}
              {messageRow}
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

      // Replace the max fee value with the equation for Anesthesia results
      var maxFee = null;
      if(recentResults[i].secondaryType === "Anesthesia" && !_.includes(["99100", "99116", "99135", "99140"], recentResults[i].serviceCode)) {
        maxFee = <span>= {recentResults[i].maximumFee} x ({recentResults[i].baseUnits} + {recentResults[i].modifierValue} + TIME UNITS)</span>;
        
      } else {
        maxFee = <span>{recentResults[i].maximumFee}</span>;
      }
      
      resultsRows.push(

              <tr className="recent-results-row">
                <td>
                  <strong>Fee Schedule:</strong><br/>
                   {"    "}{feeSchedule}<br/>
                  <strong>Region:</strong><br/>
                   {recentResults[i].region}<br/>
                  <strong>Code:</strong><br/>
                  {"(" + recentResults[i].codeType + "):"} {" "} {recentResults[i].serviceCode}<br/>
                  <strong>Modifier:</strong><br/>
                   {recentResults[i].modifier}
                </td>
                
                <td>
                  <strong>Maximum Fee:</strong><br/>
                   {maxFee}<br/>
                  <strong>Base Units:</strong><br/>
                   {recentResults[i].baseUnits}<br/>
                  <strong>Multi-Surgery Reduction Applies:</strong><br/>
                    {recentResults[i].multiSurgApplies}<br/>
                  <strong>Bilateral Surgery Reduction Applies:</strong><br/>
                    {recentResults[i].bilatSurgApplies}<br/>
                </td>
              </tr>

        );
    }
    resultsRows.reverse;
    
    return (
      <Panel header="Recent Searches" className="MfsPanels">
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

// To be used for displaying helpful terms and definitions
class MfsKey extends Component {
  render() {
    return (
        <div className="mfs-key" >
          <h3>Terms and Information</h3>
          <ListGroup>
            <ListGroupItem header="Put the term here">Definition goes here.</ListGroupItem>
            <ListGroupItem header="Put the term here">Definition goes here.</ListGroupItem>
          </ListGroup>
        </div>
      );
  }
}

class Footer extends Component {
  render() {
    return(
      <Grid>
        <hr />
        <footer>
          <a href="#">VWC Public Website</a>
        </footer>
      </Grid>
      );
  }
}

export default App;
