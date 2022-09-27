import React, { Component } from 'react';
import { Form, Button, Col, Row, Tabs, Tab } from 'react-bootstrap';
import { ResponsiveLine } from '@nivo/line'
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

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

        const ResultsFile= this.props.inputValues.Motion

        const styles = {
                tooltip: {
                    // width: "92px",
                    // height: "36px",
                    borderRadius: "18px",
                    boxShadow: "0 20px 80px 0",
                    backgroundColor: "green"
                }
            };

        const CustomTooltip = withStyles(styles)(Tooltip);

        return( 
          <Tabs id="CSMIP_Tabs" activeKey="Results" transition={false}>
            <Tab eventKey="Reference_Site" title="Reference Site" disabled />
            <Tab eventKey="Target_Site" title="Target Site" disabled/>
            <Tab eventKey="Ground_Motion" title="Ground Motion" disabled/>
            <Tab eventKey="Analysis_Parameters" title="Analysis Parameters" disabled/>
            <Tab eventKey="Results" title="Results">
            <p></p>

            <Form  onSubmit={this.saveAndContinue} validated>
                <Row> 
                    <Col xs={8}>
                      <div style={{ height: "250px" }}>
                        <Tabs id="Results" defaultActiveKey="Input_Motion" transition={false} >
                            <Tab eventKey="Transfer_Functions" title="Transfer Functions">
                                <div style={{ height: 450 }}>
                                    <ResponsiveLine
                                      data={this.props.inputValues.Transfer_Functions}
                                      margin={{ top: 50, right: 0, bottom: 50, left: 70 }}
                                      xScale={{ type: 'log', base: 10, max: 'auto' }}
                                      yScale={{ type: 'linear', min:"auto",  max: 'auto' }}
                                      axisBottom={{ orient: 'bottom', tickSize: 5, tickPadding: 5, legend: 'Frequency (Hz)', legendOffset: 36, legendPosition: 'middle', tickRotation: 0,  tickValues: [0.01, 0.1, 1.0, 10]}}
                                      axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: 0, legend: 'Fourier Amplitude (g-s)', legendOffset: -60, legendPosition: 'middle',}}
                                      colors={{ scheme: 'category10' }}
                                      enablePoints={false}
                                      useMesh={true}

                                      legends={[
                                                {
                                                anchor: 'top-left',
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

                            <Tab eventKey="Input_Motion" title="Generate Input Motion">
                                <p> </p>
                                <Form.Group as={Row} controlId="Date" >
                                  <Col xs={6}><CustomTooltip title="Select Ground Motion for the Reference site" placement="down" ><Form.Label> <h6>1) Select Ground Motion </h6></Form.Label></CustomTooltip></Col>
                                  <Col xs={4}>
                                      <Form.Control as="select" name= "Motion_File" defaultValue={this.props.inputValues.Motion_File} required onChange={this.props.handleChange}>
                                        <option value="Chi_Chi_1999">Chi-Chi (1999)</option>
                                        <option value="Kobe_1995">Kobe (1995)</option>
                                      </Form.Control>
                                  </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="Date" >
                                  <Col xs={6}><Form.Label> <h6>2) <font color="red">OR</font> Upload Motion File </h6> </Form.Label></Col>
                                  <Col xs={4}><Form.Control type="file" name ="Motion_File" accept=".txt" onChange={this.props.handleFile} /></Col>
                                </Form.Group>

                                <div style={{ height: 300 }}>
                                    <ResponsiveLine
                                      data={this.props.inputValues.Motion}
                                      margin={{ top: 10, right: 0, bottom: 50, left: 70 }}
                                      xScale={{ type: 'linear', min:"auto",  max: 'auto' }}
                                      yScale={{ type: 'linear', min:"auto",  max: 'auto' }}
                                      axisBottom={{ orient: 'bottom', tickSize: 5, tickPadding: 5, legend: 'Time (s)', legendOffset: 36, legendPosition: 'middle', tickRotation: 0}}
                                      axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: 0, legend: 'Acceleration (g)', legendOffset: -60, legendPosition: 'middle',}}
                                      // colors={{ scheme: 'category10' }}
                                      enablePoints={false}
                                      useMesh={true}

                                      legends={[
                                                {
                                                anchor: 'bottom-right',
                                                direction: 'row',
                                                justify: false,
                                                translateX: -50,
                                                translateY: -10,
                                                itemsSpacing: 0,
                                                itemDirection: 'left-to-right',
                                                itemWidth: 100,
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

                <p> </p>
                <Button variant="secondary" onClick={this.back}>Back</Button>{' '}
                <Button variant="primary" onClick={this.props.downloadFile}> Download Input Motion </Button>
              </Form>



            </Tab>
          </Tabs>
        );
    }
}

export default Results;