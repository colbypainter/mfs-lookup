
// Set the first row of the results table, with icon

var resultsIndicator = null;
if(this.props.maximumFee === "Not Found") {
  resultsIndicator = 
  <th><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></th>;
}


var maxFeeRow = null;
var baseUnitsRow = null;
var conversionRateRow = null;
var PSUModifierRow = null;

if(this.props.secondaryServiceType === "Anesthesia") {
  baseUnitsRow = <tr><td>Base Units</td><td>{this.props.baseUnits}</td></tr>;
  conversionRateRow = <tr><td>Conversion Rate</td><td>{this.props.maximumFee}</td></tr>;
  PSUModifierRow = <tr><td>Physical Status Units</td><td>{this.props.modifier}: {this.props.modifierValue} Units</td></tr>;
  maxFeeRow = <tr><td>Maximum Fee</td><td>= {this.props.maximumFee} x {this.props.baseUnits} x {this.props.modifierValue + " x " +}TIME UNITS</td></tr>;
  
} else {
  maxFeeRow = <tr><td>Maximum Fee</td><td>this.props.maximumFee</td></tr>;
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
        <tr>
          {(conversionRateRow !== null) && conversionRateRow}
          {baseUnitsRow}
          {PSUModifierRow}
          {maxFeeRow}
        </tr>
      </tbody>
    </Table>
  
  </Panel>
);