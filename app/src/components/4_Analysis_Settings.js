import React, { Component } from 'react';
import { Form, Button, Col, Row, Container, Tabs, Tab, checkbox, Spinner } from 'react-bootstrap';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from "@nivo/bar";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";




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
        <Tabs id="CSMIP_Tabs" activeKey="Analysis_Settings" transition={false}>
          <Tab eventKey="Reference_Site" title="Reference Site" disabled />
          <Tab eventKey="Target_Site" title="Target Site" disabled/>
          <Tab eventKey="Ground_Motion" title="Ground Motion" disabled/>

            <Tab eventKey="Analysis_Settings" title="Analysis Settings" >
            <p></p>
            <Form validated onSubmit={this.saveAndContinue} validated >

              <Row> 
                <Col xs={8}>

                  <h6>Calculation Parameters</h6>
                  <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                    <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Error tolerance is the limit at which the iterative process will terminate. "placement="right" ><Form.Label> &nbsp;&nbsp; Error Tolerance (%) </Form.Label></CustomTooltip></Col>
                    <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "Tol" defaultValue={this.props.inputValues.Tol} required onChange={this.props.handleChange}/></Col>
                  </Form.Group> 
                  <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                    <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Maximum number of iterations to perform." placement="right" ><Form.Label> &nbsp;&nbsp; Maximum Iterations </Form.Label></CustomTooltip></Col>
                    <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "MaxIter" defaultValue={this.props.inputValues.MaxIter} required onChange={this.props.handleChange}/></Col>
                  </Form.Group>  
                  <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                    <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Ratio between the maximum strain and effective strain used to compute strain compatible properties." placement="right" ><Form.Label> &nbsp;&nbsp; Effective Strain Ratio</Form.Label></CustomTooltip></Col>
                    <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "EffStrain" defaultValue={this.props.inputValues.EffStrain} required onChange={this.props.handleChange}/></Col>
                  </Form.Group>  
                  <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                    <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Maximum frequency for analysis." placement="right" ><Form.Label> &nbsp;&nbsp; Maximum Frequency</Form.Label></CustomTooltip></Col>
                    <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "MaxFreq" defaultValue={this.props.inputValues.MaxFreq} required onChange={this.props.handleChange}/></Col>
                  </Form.Group> 
                  <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                    <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Minimum wavelength fraction." placement="right" ><Form.Label> &nbsp;&nbsp; Wavelength Fraction</Form.Label></CustomTooltip></Col>
                    <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "WavFrac" defaultValue={this.props.inputValues.WavFrac} required onChange={this.props.handleChange}/></Col>
                  </Form.Group>

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
                <p></p>
              
              <Button variant="secondary" onClick={this.back}>Back</Button>{' '}
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