import React, { Component } from 'react';
import { Form, Button, Col, Row, Container, Tabs, Tab } from 'react-bootstrap';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from "@nivo/bar";



class Ground_Motion extends Component{

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
        const data             = this.props.inputValues.FAS

        console.log(data)
        return( 
          <Tabs id="CSMIP_Tabs" activeKey="Ground_Motion" transition={false}>
            <Tab eventKey="Reference_Site" title="Reference Site" disabled />
            <Tab eventKey="Target_Site" title="Target Site" disabled/>
            <Tab eventKey="Ground_Motion" title="Ground Motion">

            <br></br>
            <Form  onSubmit={this.saveAndContinue} validated>

              <h5> &nbsp;&nbsp;Enter Earthquake Source Information </h5>        
              <Form.Group as={Row} controlId="Date"  style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                <Col sm={{ span: 2, offset: 0}}><Form.Label> &nbsp;&nbsp; Magnitude (Mw) </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0}}><Form.Control type="text" name = "Magnitude" defaultValue={this.props.inputValues.Magnitude} required onChange={this.props.handleChange}/></Col>

                <Col sm={{ span: 2, offset: 0}}><Form.Label> &nbsp;&nbsp; Distance (km) </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0}}><Form.Control type="text" name = "Distance" defaultValue={this.props.inputValues.Distance} required onChange={this.props.handleChange}/></Col>

                <Col sm={{ span: 2, offset: 0}}><Form.Label> &nbsp;&nbsp; Select Region </Form.Label></Col>
                <Col sm={{ span: 2, offset: 0}}>
                    <Form.Control as="select" name= "Region" defaultValue={this.props.inputValues.Region} required onChange={this.props.handleChange}>
                      <option value="cena">CENA- Central and Eastern North America</option>
                      <option value="wna">WNA- Western North America</option>
                    </Form.Control>
                </Col>
              </Form.Group>

              <h5> &nbsp;&nbsp;<font color="red">OR</font> Upload Frequency Amplitude Spectrum File </h5>
                <Form.Group as={Row} controlId="Date" >
                 <Col sm={{ span: -1, offset: 0 }}><Form.Label> &nbsp;&nbsp; </Form.Label></Col>
                 <Col sm={{ span: 0, offset: 0 }}><Form.Control type="file" name ="FASFile" accept=".txt" onChange={this.props.handleFile} /></Col>
              </Form.Group>

              <div style={{ height: "400px" }}>

                <ResponsiveLine
                  data={data}
                  margin={{ top: 50, right: 110, bottom: 50, left: 70 }}
                  xScale={{ type: 'log', base: 10, max: 'auto' }}
                  // yScale={{ type: 'log', base: 10, max: 'auto' }}
                  axisBottom={{ orient: 'bottom', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Frequency (Hz)', legendOffset: 36, legendPosition: 'middle', tickRotation: -90,  tickValues: [0.01, 0.1, 1.0, 10]}}
                  axisTop={{ orient: 'top', tickSize: 5, tickValues: [0.01, 0.1, 1.0, 10]}}
                  axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: 0, legend: 'Fourier Amplitude (g-s)', legendOffset: -60, legendPosition: 'middle',}}
                  axisRight={{ orient: 'right', tickSize: 5,  tickRotation: 0}}
                  colors={{ scheme: 'category10' }}
                  enablePoints={false}
                  useMesh={true}
               />
              </div>

              <p> </p>
              <Button variant="secondary" onClick={this.back}>Back</Button> {' '}
              <Button variant="primary" type="submit">Next</Button>
              </Form>
            </Tab>
            <Tab eventKey="Analyze" title="Analysis" disabled/>
            <Tab eventKey="Results" title="Results" disabled/>
          </Tabs>
        );
    }
}

{/* <Button variant="secondary" onClick={this.back}>Back</Button>{' '}
{whether_analyzed ? (<Button variant="primary" type="Submit"><Spinner as="span" animation="grow" size="sm" animation="border"/> Analyze</Button>) : 
  (<Button variant="primary" type="Submit">Analyze</Button>)
} */}

export default Ground_Motion;