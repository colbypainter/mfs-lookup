import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col, Navbar, Jumbotron, ListGroup, ListGroupItem, 
        Button, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table } from 'react-bootstrap';

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
            <MfsLookup />
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

// Should this extend the Bootstrap Form component?
class MfsLookup extends Component {
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
                  <option value="Region 2">Region 2</option>
                  <option value="Region 3">Region 3</option>
                  <option value="Region 4">Region 4</option>
                  <option value="Region 5">Region 5</option>
                  <option value="Region 6">Region 6</option>
                </FormControl>
            </FormGroup>
          </Col>
          
          <Col md={7}>
            <FormGroup>
              <ControlLabel>Provider Category</ControlLabel>
                <FormControl componentClass="select">
                  <option value="">Select One</option>
                  <option value="IpAcuteTypeOne">Acute Inpatient Hospital Stay - Type One Teaching Hospital</option>
                  <option value="IpAcuteTypeTwo">Acute Inpatient Hospital Stay - Other Hospital</option>
                  <option value="IpRehab">Rehabilitation Admissions</option>
                  <option value=""></option>
                  <option value=""></option>
                  <option value=""></option>
                </FormControl>
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
                  <option value="">PH</option>
                  <option value="">PH</option>
                  <option value="">PH</option>
                  <option value="">PH</option>
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
