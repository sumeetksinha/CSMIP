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
                <Row> 
                    <Col xs={8}>
                      <div style={{ height: "250px" }}>
                        <ResponsiveLine
                          data={data}
                          margin={{ top: 10, right: 10, bottom: 70, left: 70 }}
                          xScale={{ type: 'log', base: 10, max: 'auto' }}
                          // yScale={{ type: 'log', base: 10, max: 'auto' }}
                          axisBottom={{ orient: 'bottom', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Frequency (Hz)', legendOffset: 36, legendPosition: 'middle', tickRotation: -90,  tickValues: [0.01, 0.1, 1.0, 10]}}
                          // axisTop={{ orient: 'top', tickSize: 5, tickValues: [0.01, 0.1, 1.0, 10]}}
                          axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: 0, legend: 'Fourier Amplitude (g-s)', legendOffset: -60, legendPosition: 'middle',}}
                          // axisRight={{ orient: 'right', tickSize: 5,  tickRotation: 0}}
                          colors={{ scheme: 'category10' }}
                          enablePoints={false}
                          useMesh={true}
                       />
                      </div>
                      <div style={{ height: "250px" }}>
                        <ResponsiveLine
                          data={data}
                          margin={{ top: 10, right: 10, bottom: 70, left: 70 }}
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

                  </Col>

                  <Col xs={4}>
                    <Tabs id="Profiles" defaultActiveKey="Vs_Profile" transition={false} >
                        <Tab eventKey="Vs_Profile" title="Shear Wave Velocity">
                            <div style={{ height: 450 }}>
                                <ResponsiveLine
                                  data={this.props.inputValues.Site_Vs_Profile}
                                  margin={{ top: 50, right: 0, bottom: 10, left: 70 }}
                                  xScale={{ type: 'linear', min:"auto",  max: 'auto' }}
                                  yScale={{ type: 'linear', min:"auto",  max: 'auto', reverse:true }}
                                  axisTop={{ orient: 'top', tickSize: 5, legend: 'Shear Velocity Vs (m/s)' , legendOffset: -40, legendPosition: 'middle'}}
                                  axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: 0, legend: 'Depth (m)', legendOffset: -40, legendPosition: 'middle',}}
                                  colors={{ scheme: 'category10' }}
                                  enablePoints={false}
                                  useMesh={true}

                                  legends={[
                                            {
                                            anchor: 'bottom-left',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 10,
                                            translateY: -10,
                                            itemsSpacing: 0,
                                            itemDirection: 'left-to-right',
                                            itemWidth: 80,
                                            itemHeight: 20,
                                            itemOpacity: 0.75,
                                            symbolSize: 12,
                                            symbolShape: 'circle',
                                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                               />
                           </div>
                        </Tab>

                        <Tab eventKey="Damping_Profile" title="Damping">
                            <div style={{ height: 450 }}>
                                <ResponsiveLine
                                  data={this.props.inputValues.Site_Damping_Profile}
                                  margin={{ top: 50, right: 0, bottom: 10, left: 70 }}
                                  xScale={{ type: 'linear', min:0,  max: 1.0 }}
                                  yScale={{ type: 'linear', min:"auto",  max: 'auto', reverse:true }}
                                  axisTop={{ orient: 'top', tickSize: 5, legend: 'Damping' , legendOffset: -40, legendPosition: 'middle'}}
                                  axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: 0, legend: 'Depth (m)', legendOffset: -40, legendPosition: 'middle',}}
                                  colors={{ scheme: 'category10' }}
                                  enablePoints={false}
                                  useMesh={true}

                                  legends={[
                                            {
                                            anchor: 'bottom-left',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 10,
                                            translateY: -10,
                                            itemsSpacing: 0,
                                            itemDirection: 'left-to-right',
                                            itemWidth: 80,
                                            itemHeight: 20,
                                            itemOpacity: 0.75,
                                            symbolSize: 12,
                                            symbolShape: 'circle',
                                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                               />
                           </div>
                        </Tab>
                      </Tabs>
                  </Col>
                </Row>



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