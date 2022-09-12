import React, { Component } from 'react';
import { Form, Button, Col, Row, Container, Tabs, Tab } from 'react-bootstrap';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from "@nivo/bar";

class Results extends Component{

    back  = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    };

    render() {

        const data = this.props.inputValues.AccelTransferFunctionOutput
        const ResultsFile= this.props.inputValues.ResultsFile

        return( 
          <Tabs id="CSMIP_Tabs" activeKey="Results" transition={false}>
            <Tab eventKey="Project_Information" title="Project Information" disabled/>
            <Tab eventKey="Ground_Motion" title="Select Ground Motion" disabled/>
            <Tab eventKey="Analyze" title="Analyze" disabled/>
            <Tab eventKey="Results" title="Results" disabled>
            <p></p>

            <Form  onSubmit={this.saveAndContinue} validated>
              
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

                 <Button variant="secondary" onClick={this.back}>Back</Button>{' '}
                 <Button variant="primary"  href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(ResultsFile))}`} download="AnalysisResults.json"> Download Results</Button>{' '}
                 {/* <Button variant="primary" type="Submit">Analyze</Button> */}
              </Form>
            </Tab>
          </Tabs>
        );
    }
}

export default Results;