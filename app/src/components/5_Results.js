import React, { Component } from 'react';
import { Form, Button, Col, Row, Tabs, Tab, Spinner } from 'react-bootstrap';
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

        const whether_processed = this.props.inputValues.whether_processed;

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

        const Site_Max_Strain_Profile_Data = this.props.inputValues.Max_Strain_Profile;
        const Max_Strain_Profile_Data = Site_Max_Strain_Profile_Data[0].data.concat(Site_Max_Strain_Profile_Data[1].data)
        var Max_Strain_Profile_MaxValue = 1.1*Math.max.apply(null,Max_Strain_Profile_Data.map(function(o) { return o.x; }));

        const Site_Response_Spectrum_Data = this.props.inputValues.Response_Spectrum;
        const Response_Spectrum_Data = Site_Response_Spectrum_Data[0].data.concat(Site_Response_Spectrum_Data[1].data)
        var Response_Spectrum_MaxValue = 1.1*Math.max.apply(null,Response_Spectrum_Data.map(function(o) { return o.y; }));

        const Site_FA_Spectrum_Data = this.props.inputValues.FA_Spectrum;
        const FA_Spectrum_Data = Site_FA_Spectrum_Data[0].data.concat(Site_FA_Spectrum_Data[1].data)
        var FA_Spectrum_MaxValue = 1.1*Math.max.apply(null,FA_Spectrum_Data.map(function(o) { return o.y; }));

        const Site_Motion_Data = this.props.inputValues.Motion;
        const Motion_Data = Site_Motion_Data[0].data.concat(Site_Motion_Data[1].data)
        var Motion_MaxValue = 1.1*Math.max.apply(null,Motion_Data.map(function(o) { return o.y; }));

        const Site_Transfer_Functions_Data = this.props.inputValues.Transfer_Functions;
        const Transfer_Functions_Data = Site_Transfer_Functions_Data[0].data.concat(Site_Transfer_Functions_Data[1].data)
        var Transfer_Functions_MaxValue = 1.1*Math.max.apply(null,Transfer_Functions_Data.map(function(o) { return o.y; }));
        
        return( 
          <Tabs id="CSMIP_Tabs" activeKey="Results" transition={false}>
            <Tab eventKey="Reference_Site" title="Reference Site" disabled />
            <Tab eventKey="Target_Site" title="Target Site" disabled/>
            <Tab eventKey="Ground_Motion" title="Ground Motion" disabled/>
            <Tab eventKey="Analysis_Parameters" title="Analysis Parameters" disabled/>
            <Tab eventKey="Results" title="Results">
            <p></p>

            <Form  onSubmit={this.saveAndContinue} validated>
                <Row > 
                    <Col xs={8}>
                      <div style={{ height: "250px" }}>
                        <Tabs id="Results" defaultActiveKey="Motion_Analysis" transition={false} >
                            <Tab eventKey="Transfer_Functions" title="Transfer Functions">
                                <div style={{ height: 550 }}>
                                    <ResponsiveLine
                                      data={this.props.inputValues.Transfer_Functions}
                                      margin={{ top: 50, right: 0, bottom: 50, left: 70 }}
                                      xScale={{ type: 'log', base: 10, max: 'auto' }}
                                      yScale={{ type: 'linear', min:0,  max: Transfer_Functions_MaxValue }}
                                      axisBottom={{ orient: 'bottom', tickSize: 5, tickRotation: -20,  legend: 'Frequency (Hz)', legendOffset: 36, legendPosition: 'middle', tickValues: [0.01, 0.1, 1.0, 10,100]}}
                                      axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: -20,  legend: 'Fourier Amplitude (g-s)', legendOffset: -60, legendPosition: 'middle',}}
                                      colors={{ datum: 'color' }}
                                      enablePoints={false}
                                      useMesh={true}

                                      legends={[
                                                {
                                                anchor: 'bottom-center',
                                                direction: 'column',
                                                justify: false,
                                                translateX: 10,
                                                translateY: 360,
                                                itemsSpacing: 0,
                                                itemDirection: 'left-to-right',
                                                itemWidth: 200,
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

                            <Tab eventKey="Motion_Analysis" title="Motion Analysis">
                                <p> </p>

                                <Form inline>
                                    <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }} >
                                        <Col xs={7}><CustomTooltip title="Select Ground Motion for the Reference site" placement="down" ><Form.Label> <h6>1) Reference Motion {whether_processed ? (<Spinner as="span" animation="border" size="sm" />) : (<font></font> )} </h6></Form.Label></CustomTooltip></Col>
                                        <Col xs={3}><Form.Control as="select" name= "Motion_File" defaultValue={this.props.inputValues.Motion_File} required onChange={this.props.handleChange}>
                                            <option value="Sample_Motion">Default </option>
                                            <option value="Sample_Motion_E0039">E0039</option>
                                            <option value="Sample_Motion_E0043">E0043</option>
                                            <option value="Sample_Motion_E0061">E0061</option>
                                            <option value="Sample_Motion_E0067">E0067</option>
                                            <option value="Sample_Motion_E0075">E0075</option>
                                            <option value="Sample_Motion_E0085">E0085</option>
                                            <option value="Sample_Motion_E0102">E0102</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }} >
                                        <Col xs={3}><Form.Label> <h6><font color="red"> &nbsp;&nbsp;&nbsp;&nbsp;  OR </font> </h6> </Form.Label></Col>
                                        <Col xs={8}><Form.Control type="file" name ="Motion_File" accept=".txt" onChange={this.props.handleFile}/></Col>
                                    </Form.Group>
                                </Form>

                                <div style={{ height: 200, width:"100%"}}>
                                    <ResponsiveLine
                                      data={this.props.inputValues.Motion}
                                      margin={{ top: 10, right: 0, bottom: 50, left: 70 }}
                                      xScale={{ type: 'linear', min:"auto",  max: 'auto' }}
                                      yScale={{ type: 'linear', min: -Motion_MaxValue,  max: Motion_MaxValue }}
                                      axisBottom={{ orient: 'bottom', tickSize: 5, tickRotation:-20, tickPadding: 5, legend: 'Time (s)', legendOffset: 36, legendPosition: 'middle'}}
                                      axisLeft={{ orient: 'left', tickSize: 5,  tickRotation:-20, legend: 'Acceleration (g)', legendOffset: -50, legendPosition: 'middle',}}
                                      colors={{ datum: 'color' }}
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

                                <div style={{ height: 300, width:"50%", float:"left"}}>
                                    <ResponsiveLine
                                      data={this.props.inputValues.FA_Spectrum}
                                      margin={{ top: 10, right: 0, bottom: 50, left: 70 }}
                                      xScale={{ type: 'log', base: 10, max: 'auto' }}
                                      yScale={{ type: 'linear', min:0,  max: FA_Spectrum_MaxValue }}
                                      axisBottom={{ orient: 'bottom', tickSize: 5, tickRotation: -20, legend: 'Frequency (Hz)', legendOffset: 36, legendPosition: 'middle', tickValues: [0.01, 0.1, 1.0, 10, 100]}}
                                      axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: -20, legend: 'Fourier Amplitude (g-s)', legendOffset: -50, legendPosition: 'middle',}}
                                      enablePoints={false}
                                      colors={{ datum: 'color' }}
                                      useMesh={true}

                                      // legends={[
                                      //           {
                                      //           anchor: 'top-left',
                                      //           direction: 'column',
                                      //           justify: false,
                                      //           translateX: 10,
                                      //           translateY: 10,
                                      //           itemsSpacing: 0,
                                      //           itemDirection: 'left-to-right',
                                      //           itemWidth: 100,
                                      //           itemHeight: 20,
                                      //           itemOpacity: 0.75,
                                      //           symbolSize: 12,
                                      //           symbolShape: 'circle',
                                      //           symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                      //           effects: [
                                      //               {
                                      //                   on: 'hover',
                                      //                   style: {
                                      //                       itemBackground: 'rgba(0, 0, 0, .03)',
                                      //                       itemOpacity: 1
                                      //                   }
                                      //               }
                                      //           ]
                                      //       }
                                      //   ]}
                                   />
                               </div>
                                <div style={{ height: 300, width:"50%", float:"right"}}>
                                    <ResponsiveLine
                                      data={this.props.inputValues.Response_Spectrum}
                                      margin={{ top: 10, right: 0, bottom: 50, left: 70 }}
                                      xScale={{ type: 'log',    base: 10, max: 'auto' }}
                                      yScale={{ type: 'linear', min:0,  max: Response_Spectrum_MaxValue }}
                                      axisBottom={{ orient: 'bottom', tickSize: 5, tickRotation: -20, legend: 'Frequency (Hz)', legendOffset: 36, legendPosition: 'middle', tickValues: [0.01, 0.1, 1.0, 10, 100]}}
                                      axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: -20, legend: 'Pseudo Spectral Acceleration (g)', legendOffset: -50, legendPosition: 'middle',}}
                                      enablePoints={false}
                                      colors={{ datum: 'color' }}
                                      useMesh={true}

                                      // legends={[
                                      //           {
                                      //           anchor: 'top-left',
                                      //           direction: 'column',
                                      //           justify: false,
                                      //           translateX: 10,
                                      //           translateY: 10,
                                      //           itemsSpacing: 0,
                                      //           itemDirection: 'left-to-right',
                                      //           itemWidth: 100,
                                      //           itemHeight: 20,
                                      //           itemOpacity: 0.75,
                                      //           symbolSize: 12,
                                      //           symbolShape: 'circle',
                                      //           symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                      //           effects: [
                                      //               {
                                      //                   on: 'hover',
                                      //                   style: {
                                      //                       itemBackground: 'rgba(0, 0, 0, .03)',
                                      //                       itemOpacity: 1
                                      //                   }
                                      //               }
                                      //           ]
                                      //       }
                                      // ]}
                                   />
                               </div>

                            </Tab>
                        </Tabs>
                    </div>
                  </Col>

                  <Col xs={4}>
                    <Tabs id="Profiles" defaultActiveKey="Max_Strain_Profile" transition={false} >
                        <Tab eventKey="Max_Strain_Profile" title="Max Strain">
                            <div style={{ height: 550 }}>
                                <ResponsiveLine
                                  data={this.props.inputValues.Max_Strain_Profile}
                                  margin={{ top: 50, right: 0, bottom: 10, left: 70 }}
                                  xScale={{ type: 'linear', min:"auto",  max: Max_Strain_Profile_MaxValue }}
                                  yScale={{ type: 'linear', min:"auto",  max: "auto" , reverse:true }}
                                  axisTop={{ orient: 'top', tickSize: 5, tickRotation: -20, legend: 'Strain (%)' , legendOffset: -40, legendPosition: 'middle'}}
                                  axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: -20, legend: 'Depth (m)', legendOffset: -40, legendPosition: 'middle',}}
                                  colors={{ datum: 'color' }}
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
                        <Tab eventKey="Vs_Profile" title="Vs">
                            <div style={{ height: 550 }}>
                                <ResponsiveLine
                                  data={this.props.inputValues.Site_Vs_Profile}
                                  margin={{ top: 50, right: 0, bottom: 10, left: 70 }}
                                  xScale={{ type: 'linear', min:"auto",  max: 'auto' }}
                                  yScale={{ type: 'linear', min:"auto",  max: 'auto', reverse:true }}
                                  axisTop={{ orient: 'top', tickSize: 5, tickRotation: -20,legend: 'Shear Velocity Vs (m/s)' , legendOffset: -40, legendPosition: 'middle'}}
                                  axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: -20, legend: 'Depth (m)', legendOffset: -40, legendPosition: 'middle',}}
                                  colors={{ datum: 'color' }}
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
                            <div style={{ height: 550 }}>
                                <ResponsiveLine
                                  data={this.props.inputValues.Site_Damping_Profile}
                                  margin={{ top: 50, right: 0, bottom: 10, left: 70 }}
                                  xScale={{ type: 'linear', min:"auto",  max: 'auto' }}
                                  yScale={{ type: 'linear', min:"auto",  max: 'auto', reverse:true }}
                                  axisTop={{ orient: 'top', tickSize: 5, tickRotation: -20, legend: 'Damping (%)' , legendOffset: -40, legendPosition: 'middle'}}
                                  axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: -20, legend: 'Depth (m)', legendOffset: -40, legendPosition: 'middle',}}
                                  colors={{ datum: 'color' }}
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
                <Button variant="primary" onClick={this.props.downloadFile}> Download Target Motion </Button>
              </Form>



            </Tab>
          </Tabs>
        );
    }
}

export default Results;