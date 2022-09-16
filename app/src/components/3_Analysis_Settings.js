import React, { Component } from 'react';
import { Form, Button, Col, Row, Container, Tabs, Tab, checkbox, Spinner } from 'react-bootstrap';
// import "bootstrap/dist/css/bootstrap.min.css";

// import Panel from 'react-bootstrap/lib/Panel'




class Analysis_Settings extends Component{

    back  = (e) => {
      e.preventDefault();
      this.props.prevStep();
    }

    saveAndContinue = (e) => {
      e.preventDefault();
      this.props.nextStep();
    };

    render() {

      const whether_analyzed = this.props.inputValues.whether_analyzed;
      return( 
        <Tabs id="CSMIP_Tabs" activeKey="Analysis_Settings" transition={false}>
          <Tab eventKey="Reference_Site" title="Reference Site" disabled />
          <Tab eventKey="Target_Site" title="Target Site" disabled/>
          <Tab eventKey="Ground_Motion" title="Ground Motion" disabled/>

            <Tab eventKey="Analysis_Settings" title="Analysis" >
            <p></p>
            <Form validated onSubmit={this.saveAndContinue} validated>

              <h4>Calculation Parameters</h4>
              <Form.Group as={Row} controlId="Date">
                <Col sm={{ span: 3, offset: 0 }}><Form.Label> &nbsp;&nbsp; Error Tolerance (%) </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0 }}><Form.Control type="text" name = "Tol" defaultValue={this.props.inputValues.Tol} required onChange={this.props.handleChange}/></Col>
              </Form.Group> 
              <Form.Group as={Row} controlId="Date">
                <Col sm={{ span: 3, offset: 0 }}><Form.Label> &nbsp;&nbsp; Maximum Iterations </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0 }}><Form.Control type="text" name = "MaxIter" defaultValue={this.props.inputValues.MaxIter} required onChange={this.props.handleChange}/></Col>
              </Form.Group>  

              <Form.Group as={Row} controlId="Date">
                <Col sm={{ span: 3, offset: 0 }}><Form.Label> &nbsp;&nbsp; Effective Strain Ratio </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0 }}><Form.Control type="text" name = "EffStrain" defaultValue={this.props.inputValues.EffStrain} required onChange={this.props.handleChange}/></Col>
              </Form.Group>  

              <h4>Layer Descretizations</h4>
              <Form.Group as={Row} controlId="Date">
                <Col sm={{ span: 3, offset: 0 }}><Form.Label> &nbsp;&nbsp; Maximum Frequency </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0 }}><Form.Control type="text" name = "MaxFreq" defaultValue={this.props.inputValues.MaxFreq} required onChange={this.props.handleChange}/></Col>
              </Form.Group> 

              <Form.Group as={Row} controlId="Date">
                <Col sm={{ span: 3, offset: 0 }}><Form.Label> &nbsp;&nbsp; Wavelength Fraction </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0 }}><Form.Control type="text" name = "WavFrac" defaultValue={this.props.inputValues.WavFrac} required onChange={this.props.handleChange}/></Col>
              </Form.Group>
              
              <Button variant="secondary" onClick={this.back}>Back</Button>{' '}
              {/* <Button variant="primary" type="submit">Next</Button> {' '} */}
              {whether_analyzed ? (<Button variant="primary" type="Submit"><Spinner as="span" animation="grow" size="sm" animation="border"/> Analyze</Button>) : 
                (<Button variant="primary" type="Submit">Analyze</Button>)
              }
            </Form>

            
          </Tab>
        <Tab eventKey="Results" title="Results" disabled/>
        </Tabs>
      );
  }
}

export default Analysis_Settings;