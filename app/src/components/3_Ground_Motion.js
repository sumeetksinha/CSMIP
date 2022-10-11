import React, { Component } from 'react';
import { Form, Button, Col, Row, Tabs, Tab, Spinner} from 'react-bootstrap';
import { ResponsiveLine } from '@nivo/line'
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";


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

        const Site_FAS_Data = this.props.inputValues.FAS;
        const FAS_Data = Site_FAS_Data[0].data.concat(Site_FAS_Data[1].data)
        var FAS_MaxValue = 1.1*Math.max.apply(null,FAS_Data.map(function(o) { return o.y; }));


        return( 
          <Tabs id="CSMIP_Tabs" activeKey="Ground_Motion" transition={false}>
            <Tab eventKey="Reference_Site" title="Reference Site" disabled />
            <Tab eventKey="Target_Site" title="Target Site" disabled/>
            <Tab eventKey="Ground_Motion" title="Ground Motion">

            <p></p>

              <Form  onSubmit={this.saveAndContinue} validated>
                <Row> 
                  <Col xs={8}>
                    <h6>1) Earthquake Source Information </h6> 
                    <Form.Group className="mb-2" as={Row} controlId="Date"  style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                      <Col xs={2.5}><CustomTooltip title="Earthquake Magnitue" placement="down" ><Form.Label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Magnitude (M<sub>w</sub>) </Form.Label></CustomTooltip></Col>
                      <Col xs={2}><Form.Control type="text" name = "Magnitude" defaultValue={this.props.inputValues.Magnitude} required onChange={this.props.handleChange}/></Col>

                      <Col xs={2.5}><CustomTooltip title="Distance of target site from earthquake source" placement="down" ><Form.Label>Distance (km) </Form.Label></CustomTooltip></Col>
                      <Col xs={2}><Form.Control type="text" name = "Distance" defaultValue={this.props.inputValues.Distance} required onChange={this.props.handleChange}/></Col>

                      <Col xs={1.0}><CustomTooltip title="Region in USA" placement="down" ><Form.Label>Region </Form.Label></CustomTooltip></Col>
                      <Col xs={3}>
                          <Form.Control as="select" name= "Region" defaultValue={this.props.inputValues.Region} required onChange={this.props.handleChange}>
                            <option value="cena">CENA</option>
                            <option value="wna">WNA</option>
                          </Form.Control>
                      </Col>

                    </Form.Group>

                    <p></p>

                    <Form inline>
                        <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }} >
                            <Col xs={13}><Form.Label> <h6> &nbsp;&nbsp; 2) Frequency Amplitude Spectrum 
                            &nbsp;&nbsp; {whether_analyzed ? (<Button variant="primary"  onClick={this.props.Generate_FAS} ><Spinner as="span" animation="grow" size="sm" animation="border"/> Generate</Button>) : 
                                        (<Button variant="primary" onClick={this.props.Generate_FAS} >Generate</Button>) }</h6></Form.Label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }} >
                            <Col xs={4}><Form.Label> <h6><font color="red"> &nbsp;&nbsp;&nbsp;&nbsp; OR </font> </h6> </Form.Label></Col>
                            <Col xs={8}><Form.Control  type="file" name ="FASFile" accept=".txt" onChange={this.props.handleFile}/></Col>
                        </Form.Group>
                    </Form>
                    <p></p> 

                    <div style={{ height: "350px" }}>
                      <ResponsiveLine
                        data={data}
                        margin={{ top: 0, right: 0, bottom: 50, left: 70 }}
                        xScale={{ type: 'log', base: 10, max: 'auto' }}
                        yScale={{ type: 'linear', min:0, max: FAS_MaxValue }}
                        axisBottom={{ orient: 'bottom', tickSize: 10, tickPadding: 5, tickRotation: -20, legend: 'Frequency (Hz)', legendOffset: 36, legendPosition: 'middle', tickValues: [0.01, 0.1, 1.0, 10,100]}}
                        axisLeft={{ orient: 'left', tickSize: 10, tickPadding: 5, tickRotation: -20, legend: 'Fourier Amplitude (g-s)', legendOffset: -60, legendPosition: 'middle',}}
                        colors={{ datum: 'color' }}
                        enablePoints={false}
                        useMesh={true}
                     />
                    </div>

                  </Col>

                  <Col xs={4}>
                    <Tabs id="Profiles" defaultActiveKey="Vs_Profile" transition={false} >
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
                <Button variant="secondary" onClick={this.back}>Back</Button> {' '}
                <Button variant="primary" type="submit">Next</Button>
              </Form>
            </Tab>
            <Tab eventKey="Analysis_Parameters" title="Analysis Parameters" disabled/>
            <Tab eventKey="Results" title="Results" disabled/>
          </Tabs>
        );
    }
}

export default Ground_Motion;