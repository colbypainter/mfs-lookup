import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo100x100.png';
import './App.css';
import { Grid, Row, Col, Nav, NavItem, NavDropdown, MenuItem, Navbar, Jumbotron, ListGroup, ListGroupItem, 
        Button, Checkbox, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table, Panel } from 'react-bootstrap/lib';


var _ = require('lodash');
// Load the zipcode-region mapping file
var zipMap = require('./model/zipMap.json');
// Load the By Report Codes for all BR results
var byReportCodes = require('./model/byReportCodes.json');
// Load the configuration file that determines what options present for each schedule
var scheduleConfig = require('./model/scheduleConfig.json');

// Make the schedule accessible via the url that will be built based on user input
const schedules = {
  './model/hospitalInpatientRehabCMG.json': require('./model/hospitalInpatientRehabCMG.json'),
  './model/hospitalInpatientAcuteDRGTypeOneHospital.json': require('./model/hospitalInpatientAcuteDRGTypeOneHospital.json'),
  './model/hospitalInpatientAcuteDRGOtherHospital.json': require('./model/hospitalInpatientAcuteDRGOtherHospital.json'),
  './model/hospitalInpatientRehabDRGTypeOneHospital.json': require('./model/hospitalInpatientRehabDRGTypeOneHospital.json'),
  './model/hospitalInpatientRehabDRGOtherHospital.json': require('./model/hospitalInpatientRehabDRGOtherHospital.json'),
  './model/hospitalInpatientRehabREVENUETypeOneHospital.json': require('./model/hospitalInpatientRehabREVENUETypeOneHospital.json'),
  './model/hospitalInpatientRehabREVENUEOtherHospital.json': require('./model/hospitalInpatientRehabREVENUEOtherHospital.json'),
  './model/hospitalOutpatientCPTTypeOneHospital.json': require('./model/hospitalOutpatientCPTTypeOneHospital.json'),
  './model/hospitalOutpatientCPTOtherHospital.json': require('./model/hospitalOutpatientCPTOtherHospital.json'),
  './model/hospitalOutpatientHCPCSTypeOneHospital.json': require('./model/hospitalOutpatientHCPCSTypeOneHospital.json'),
  './model/hospitalOutpatientHCPCSOtherHospital.json': require('./model/hospitalOutpatientHCPCSOtherHospital.json'),
  './model/hospitalOutpatientREVENUETypeOneHospital.json': require('./model/hospitalOutpatientREVENUETypeOneHospital.json'),
  './model/hospitalOutpatientREVENUEOtherHospital.json': require('./model/hospitalOutpatientREVENUEOtherHospital.json'),
  './model/hospitalOutpatientREVENUECPTTypeOneHospital.json': require('./model/hospitalOutpatientREVENUECPTTypeOneHospital.json'),
  './model/hospitalOutpatientREVENUECPTOtherHospital.json': require('./model/hospitalOutpatientREVENUECPTOtherHospital.json'),
  './model/hospitalOutpatientREVENUEHCPCSTypeOneHospital.json': require('./model/hospitalOutpatientREVENUEHCPCSTypeOneHospital.json'),
  './model/hospitalOutpatientREVENUEHCPCSOtherHospital.json': require('./model/hospitalOutpatientREVENUEHCPCSOtherHospital.json'),
  './model/ascCPT.json': require('./model/ascCPT.json'),
  './model/ascREVENUE.json': require('./model/ascREVENUE.json'),
  './model/profAnesthesiaCPT.json': require('./model/profAnesthesiaCPT.json'),
  './model/profAllOtherServicesCPTSurgeon.json': require('./model/profAllOtherServicesCPTSurgeon.json'),
  './model/profAllOtherServicesCPTNon-Surgeon.json': require('./model/profAllOtherServicesCPTNon-Surgeon.json'),
  './model/profAllOtherServicesHCPCSSurgeon.json': require('./model/profAllOtherServicesHCPCSSurgeon.json'),
  './model/profAllOtherServicesHCPCSNon-Surgeon.json': require('./model/profAllOtherServicesHCPCSNon-Surgeon.json'),
  './model/profInjectableDrugsCPT.json': require('./model/profInjectableDrugsCPT.json'),
  './model/profInjectableDrugsHCPCS.json': require('./model/profInjectableDrugsHCPCS.json'),
  './model/physMedRehabServicesCPT.json': require('./model/physMedRehabServicesCPT.json'),
  './model/physMedRehabServicesHCPCS.json': require('./model/physMedRehabServicesHCPCS.json'),
  './model/osteoChiroCPT.json': require('./model/osteoChiroCPT.json'),
  './model/acupunctureCPT.json': require('./model/acupunctureCPT.json'),
  './model/dentalHCPCS.json': require('./model/dentalHCPCS.json'),
  './model/ambulanceHCPCS.json': require('./model/ambulanceHCPCS.json'),
  './model/scodesHCPCS.json': require('./model/scodesHCPCS.json'),
  './model/profInjectableDrugsHCPCSJ-Code.json': require('./model/profInjectableDrugsHCPCSJ-Code.json'),
  './model/hospitalOutpatientHCPCSJ-CodeTypeOneHospital.json': require('./model/hospitalOutpatientHCPCSJ-CodeTypeOneHospital.json'),
  './model/hospitalOutpatientHCPCSJ-CodeOtherHospital.json': require('./model/hospitalOutpatientHCPCSJ-CodeOtherHospital.json')
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
      recentResults: [],
      isFormValid: false
    };
  }
  componentWillUpdate(nextProps, nextState) {
    let isFormValid = true,
        lf = this.refs.testLookupForm;
    if(lf){
      console.log(lf);
      for(var key in lf.refs){
        if(!nextState[key]){
          isFormValid = false;
        }             
      }
    }

     nextState.isFormValid = isFormValid;
  }
  
  changeRegion = (event) =>  { 
    var newRegion = event.target.value;
    this.setState((state, props) => ({
      region: newRegion,
      per: null,
      maximumFee: null
    }));
  }
  
  changeServiceType = (event) => {
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
  
  changeSecondaryType = (event) => {
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
  

  
  changeCodeType = (event) => {
    var newCodeType = event.target.value;
    var newServiceCode = "";
    // All JCodes map to the same value, so populate the service code and lock down the input
    if (newCodeType === "HCPCS J-Code") {
      newServiceCode = "JCODE";
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
  
  changeProviderType = (event) => {
    var newProvType = event.target.value;
    this.setState((state, props) => ({
      providerType: newProvType,
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
      maximumFee: null
    }));

  }
  
  changeServiceCode = (event) => {
    var newServiceCode = event.target.value;
    this.setState((state, props) => ({
      serviceCode: newServiceCode,
      multiSurgApplies: null,
      bilatSurgApplies: null,
      per: null,
      maximumFee: null
    }));

  }
  
  changeModifier = (event) => {
    var newModifier = event.target.value;
    // P modifiers map to a specific value to be used in the anesthesia equation
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
  
  createSchedulePath = () => {
    // Get the base schedule ID
    var id = this.state.serviceType;
    var schedule = _.find(scheduleConfig.schedules, { 'id': id});
    
    // Start the path using the basePath of that schedule
    var path = `model/${schedule.basePath}`;
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
  querySchedule = (pathname, cd, reg) => {
    
    // If there's a modifier that ISN'T a P modifier, add it to the service code
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
  changeMaximumFee = (fee) => {
    var newMaxFee = fee;
    this.setState({
      maximumFee: newMaxFee
    }, function(){
      this.updateRecentResults();
    });
  }
  
  changeBaseUnits = (baseUnits) => {
    var newBaseUnits = baseUnits;
    this.setState({
      baseUnits: newBaseUnits
    });
  }
  
  changeMultiSurgApplies = (applies) => {
    var newMultiSurgApplies = applies;
    this.setState({
      multiSurgApplies: newMultiSurgApplies
    });
  }
  
  changeBilatSurgApplies = (applies) => {
    var newBilatSurgApplies = applies;
    this.setState({
      bilatSurgApplies: newBilatSurgApplies
    });
  }
  
  changePer = (perValue) => { 
    var newPer = perValue;
    this.setState({
      per: newPer
    });
  }
  
  handleSearch = (event) => {
    event.preventDefault();
    this.createSchedulePath();
  }


  
  updateRecentResults = () => {
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
            <LookupForm ref="testLookupForm" region={this.state.region} 
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
                        updateRecentResults={this.updateRecentResults}
                        isFormValid={this.state.isFormValid}

                         />
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
              <NavItem eventKey={1} href="http://www.workcomp.virginia.gov/content/virginia-medical-fee-schedules-ground-rules">Ground Rules</NavItem>
              <NavItem eventKey={2} href="http://www.workcomp.virginia.gov/content/virginia-medical-fee-schedules">Fee Schedule</NavItem>
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
          <p>Want to know more about the Fee Schedule? Please refer to our <a href="http://www.workcomp.virginia.gov/content/virginia-medical-fee-schedules-ground-rules">Ground Rules</a> documentation or view the <a href="http://www.workcomp.virginia.gov/content/virginia-medical-fee-schedules">Fee Schedule</a> itself.</p>
        </Panel>
      </div>
      );
  }
}

//// The Zip code - Region lookup form /////////////////////////////////////////////////////////////

class ZipLookup extends Component {

    constructor(props) {
        super(props);  
        this.state = {
          zip: null,
          region: null,
          message: null
        };
      }
      
      changeZip = (event) => {
        var zipInput = event.target.value;
        zipInput = zipInput.substring(0, 3);
        console.log(zipInput);
        this.setState((state, props) => ({
          zip: zipInput,
          message: null
        }));
      }
      
      findRegion = (event) => { 
        var newRegion = _.get(zipMap, this.state.zip);
        console.log(newRegion);
        this.setState((state, props) => ({
          region: newRegion,
          message: true
        }));
      }

      get isValid() {
        if(this.state.zip && this.state.zip.length === 3){
          return true;
        }
        return false;
      }
      
      render() {
        return (
          <Panel className="MfsPanels ZipLookup" header="Find Your Region">
            <Col>
             <h4>Enter the <strong>first three digits</strong> of the zip code for the location of service.</h4>
            </Col>
            <hr/>
              <Form inline onSubmit={(e) => e.preventDefault()}>
                <FormGroup role="form">
                    <ControlLabel>Zip Code&nbsp;</ControlLabel>
                    <FormControl type="text" pattern="[0-9]*" id="zip_input" placeholder="###" onChange={this.changeZip} maxLength="3" />
                </FormGroup>
                <Button className="ZipSearchButton" disabled={!this.isValid} bsStyle="primary" type="submit" onClick={this.findRegion}>Search</Button>
              </Form>
            <Col xs={8} xsOffset={2} className="zip-result">
              
              <ZipMessage region={this.state.region} message={this.state.message} zip={this.state.zip}/>
            </Col>
          </Panel>
        );
      }
  }

class ZipMessage extends Component {
  render() {
    if(this.props.message == null) { 
      return(null); 
    }
    else{
      return(
        <Panel className="results-panel MfsPanels" >
        
          <Table bordered fill>
            <thead>
              <tr>
                <th>Search Results</th>
                <th><span className={this.props.region === undefined ? 'glyphicon glyphicon-remove' : 'glyphicon glyphicon-ok'} aria-hidden="true"></span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Region</th>
                <td>{this.props.region === undefined ? 'No Region' : this.props.region}</td>
              </tr>
            </tbody>
          </Table>
        
        </Panel>
        );
    }
  }
}

///////////// The Max Fee Lookup Form ///////////////////////////////////////

class LookupForm extends Component {

  getServiceCodeLabel(codeType){
    let serviceCodeLabel = "";
    switch(codeType){
      case "REVENUE+CPT": serviceCodeLabel ="CPT";break;
      case "REVENUE+HCPCS": serviceCodeLabel = "HCPCS";break;
      case "REVENUE": serviceCodeLabel = "Revenue"; break;
      default: serviceCodeLabel = codeType;
    }
    return (<ControlLabel>{serviceCodeLabel} Code*</ControlLabel>);
  }

  getServiceCodeInput(codeType){
    let serviceCodeInputEl = null;
    if (codeType == null) {
      serviceCodeInputEl = <FormControl ref="serviceCode" type="text" disabled/>;
    } else if(codeType === "HCPCS J-Code") {
      serviceCodeInputEl = <FormControl ref="serviceCode" type="text" value="JCODE" readOnly/>;
    }
    else{
      serviceCodeInputEl = <FormControl ref="serviceCode" type="text" value={this.props.serviceCode} onChange={this.props.changeServiceCode}/>;
    }

    return serviceCodeInputEl;
  }

  getCodeTypeInput(secondaryType, serviceTypeId, secType){
    let codeTypes = secondaryType ? _.keys(secondaryType.codeType[0]) : [];
    return(
      <FormControl ref="codeType" componentClass="select" onChange={this.props.changeCodeType} disabled={!codeTypes.length}>
        <option key="default" value="">Select</option>
        {codeTypes.map((opt,key) => <option key={[serviceTypeId]+[secType]+[key]+[opt]} value={opt}>{opt}</option>)}
      </FormControl>
    );
  }

  getSecondaryTypeSelect(secondaryTypes, secType, serviceTypeId){
      if(secondaryTypes && !_.some(secondaryTypes, (secondaryType) => _.has(secondaryType, "null")) ){
     // Secondary Type Select
        // TODO: the following operation shows the current complexity of the scheduleConfig object. should be refactored. EIS
        let secondaryOptions = _.flatMap(secondaryTypes,(opt, key) => _.map(opt, (o,k) => <option key={[serviceTypeId]+[k]} value={k}>{k}</option>) );
        
        if(secondaryOptions.length){

          

          return(
              <FormGroup>
                <ControlLabel>Secondary Service Type*</ControlLabel>
                <FormControl ref="secondaryType" componentClass="select" onChange={this.props.changeSecondaryType}>
                  <option key="default" value="">Select</option>
                  {secondaryOptions}
                </FormControl>
              </FormGroup>
            );
        }
      }

      
      return null;
  }

  getModifierInput(secondaryType, codeType, secType, serviceTypeId){
      if(!secondaryType ||  !codeType){
        
        return null;
      }

      let modifiers = _.filter(secondaryType.codeType[0][codeType].modifiers);
      
      if (!modifiers.length) {
        
        return(null);
      } else {
        return (
          <FormGroup>
            <ControlLabel>Modifier</ControlLabel>
            <FormControl componentClass="select" onChange={this.props.changeModifier}>
              <option key="default" value="">Select</option>
              {modifiers.map((modifier) => <option key={[serviceTypeId]+[secType]+[codeType]+[modifier]} value={modifier}>{modifier}</option>)}
            </FormControl>
          </FormGroup>
         )
      }    
  }

  getProviderInput(secondaryType, serviceTypeId, codeType, secType){
      if(!secondaryType){
        
        return null;
      }

      /// Get the array of facility types 
      let facilityTypes = secondaryType.codeType[0][codeType] ? _.find(secondaryType.codeType[0][codeType]) : [];

      if(facilityTypes.length){
        return(
          <Col md={5}>
            <FormGroup>
              <ControlLabel>Provider Type*</ControlLabel>
                <FormControl ref="providerType" componentClass="select" onChange={this.props.changeProviderType}>
                  <option key="default" value="">Select</option>
                  {facilityTypes.map((opt, key) => <option key={[serviceTypeId]+[secType]+[codeType]+[key]+[opt]} value={opt}>{opt}</option>)}
                </FormControl>
            </FormGroup>
          </Col>
        );
      }

      
      return null;
  }

  render() {

    let codeType = this.props.codeType,
      serviceTypeId = this.props.serviceType,
      secType = this.props.secondaryType,
      schedule = serviceTypeId != null ? _.find(scheduleConfig.schedules, {'id': serviceTypeId}) : null, /// Get the ServiceType/Schedule we start with
      secondaryTypes = !schedule ? null : schedule.secondaryType,
      selectedSecondaryType = secType !== null && secondaryTypes && _.some(secondaryTypes, (o) => _.has(o, secType)) ? _.find(secondaryTypes, secType)[secType] : null;


    // ServiceCode
    let serviceCodeLabelEl = this.getServiceCodeLabel(codeType);
    let serviceCodeInputEl = this.getServiceCodeInput(codeType);
    
    // CodeType
    let codeTypeInputEl = this.getCodeTypeInput(selectedSecondaryType,serviceTypeId, secType);

    // Secondary Type Select
    let secondaryTypeSelectEl = this.getSecondaryTypeSelect(secondaryTypes, secType, serviceTypeId);

    // Provider Input
    let providerInputEl = this.getProviderInput(selectedSecondaryType, serviceTypeId, codeType, secType);
    let modifierInputEl = this.getModifierInput(selectedSecondaryType, codeType, secType, serviceTypeId);
       
    return (
      <Panel className="MfsPanels FeeLookup" header="Maximum Rate Search">
        <Form onSubmit={this.props.handleSearch}>
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Region*</ControlLabel>
              <FormControl ref="region" componentClass="select" onChange={this.props.changeRegion}>
                <option value="">Select</option>
                <option value="Region 1">Region 1</option>
                <option value="Region 2">Region 2</option>
                <option value="Region 3">Region 3</option>
                <option value="Region 4">Region 4</option>
                <option value="Region 5">Region 5</option>
                <option value="Region 6">Region 6</option>
              </FormControl>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Fee Schedule - Service Type*</ControlLabel>
              <FormControl ref="serviceType" componentClass="select" onChange={this.props.changeServiceType}>
                  <option value="">Select</option>
                  {scheduleConfig.schedules.map((schedule) =>
                    <option key={schedule.id} value={schedule.id}>{schedule.type}</option>
                  )}
              </FormControl> 
            </FormGroup>
          </Col>
          
          <Col md={4}>
            {secondaryTypeSelectEl}
          </Col>
          
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Code Type*</ControlLabel>
              {codeTypeInputEl}
            </FormGroup>
          </Col>
          
          <Col md={2}>
            <FormGroup>
              {serviceCodeLabelEl}
              {serviceCodeInputEl}
            </FormGroup>
          </Col>

          {providerInputEl}
          
          
          <Col md={2}>
              {modifierInputEl}                
          </Col>
          

          
          <Col md={12}>
              <Button bsStyle="primary" type="submit" disabled={!this.props.isFormValid}>Search</Button>
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
      let modifierSegment = null;
      if(this.props.modifierValue) {
        modifierSegment = " + " + this.props.modifierValue;
      }
      baseUnitsRow = <tr><td>Base Units</td><td>{this.props.baseUnits}</td></tr>;
      conversionRateRow = <tr><td>Conversion Rate</td><td>{this.props.maximumFee}</td></tr>;
      PSUModifierRow = <tr><td>Physical Status Units</td><td>{this.props.modifierValue}</td></tr>;
      maxFeeRow = <tr><td>Maximum Fee</td><td>= {this.props.maximumFee} x ({this.props.baseUnits} {modifierSegment} + TIME UNITS)</td></tr>;
      
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
        let modifierSegment = null;
        if(recentResults[i].modifierValue) {
          modifierSegment = " + " + recentResults[i].modifierValue;
        }
        maxFee = <span>= {recentResults[i].maximumFee} x ({recentResults[i].baseUnits} {modifierSegment} + TIME UNITS)</span>;
        
      } else {
        maxFee = <span>{recentResults[i].maximumFee}</span>;
      }
      
      resultsRows.push(

              <tr className="recent-results-row">
                <td>
                  <strong>Fee Schedule:</strong><br/>
                   <div className="recent-results-data">{feeSchedule}</div>
                  <strong>Region:</strong><br/>
                   <div className="recent-results-data">{recentResults[i].region}</div>
                  <strong>Code:</strong><br/>
                   <div className="recent-results-data">{"(" + recentResults[i].codeType + "):"} {" "} {recentResults[i].serviceCode}</div>
                  <strong>Modifier:</strong><br/>
                   <div className="recent-results-data">{recentResults[i].modifier}</div>
                </td>
                
                <td>
                  <strong>Maximum Fee:</strong><br/>
                   <div className="recent-results-data">{maxFee}</div>
                  <strong>Base Units:</strong><br/>
                   <div className="recent-results-data">{recentResults[i].baseUnits}</div>
                  <strong>Multi-Surgery Reduction Applies:</strong><br/>
                    <div className="recent-results-data">{recentResults[i].multiSurgApplies}</div>
                  <strong>Bilateral Surgery Reduction Applies:</strong><br/>
                    <div className="recent-results-data">{recentResults[i].bilatSurgApplies}</div>
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

class Footer extends Component {
  render() {
    return(
      <Grid>
        <hr />
        <footer>
          <a href="http://www.workcomp.virginia.gov/">VWC Public Website</a>
        </footer>
      </Grid>
      );
  }
}

export default App;
