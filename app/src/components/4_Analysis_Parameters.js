import React, { Component } from 'react';
import { Form, Button, Col, Row, Tabs, Tab, Spinner } from 'react-bootstrap';
import { ResponsiveLine } from '@nivo/line'
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

      var Analysis_Parameters = "";
      if (this.props.inputValues.Analysis_Type==="EQL") {
        Analysis_Parameters =  
        <div>
          <h6>2) Analysis parameters:</h6>
          <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
            <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Error tolerance is the limit at which the iterative process will terminate. "placement="right" ><Form.Label> &nbsp;&nbsp; Error tolerance (%) </Form.Label></CustomTooltip></Col>
            <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "Tol" defaultValue={this.props.inputValues.Tol} required onChange={this.props.handleChange}/></Col>
          </Form.Group> 
          <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
            <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Maximum number of iterations to perform." placement="right" ><Form.Label> &nbsp;&nbsp; Maximum iterations </Form.Label></CustomTooltip></Col>
            <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "MaxIter" defaultValue={this.props.inputValues.MaxIter} required onChange={this.props.handleChange}/></Col>
          </Form.Group>  
          <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
            <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Ratio between the maximum strain and effective strain used to compute strain-compatible properties." placement="right" ><Form.Label> &nbsp;&nbsp; Effective strain ratio</Form.Label></CustomTooltip></Col>
            <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "EffStrain" defaultValue={this.props.inputValues.EffStrain} required onChange={this.props.handleChange}/></Col>
          </Form.Group>  
          <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
            <Col sm={{ span: 8, offset: 0 }}><CustomTooltip title="Limit of strain in calculations. If this strain is exceed, the iterative calculation is ended." placement="right" ><Form.Label> &nbsp;&nbsp; Strain limit</Form.Label></CustomTooltip></Col>
            <Col sm={{ span: 4, offset: 0 }}><Form.Control type="text" name = "MaxFreq" defaultValue={this.props.inputValues.StrainLimit} required onChange={this.props.handleChange}/></Col>
          </Form.Group> 
        </div>;
      } 

      return( 
        <Tabs id="CSMIP_Tabs" activeKey="Analysis_Parameters" transition={false}>
          <Tab eventKey="Reference_Site" title="Reference site" disabled />
          <Tab eventKey="Target_Site" title="Target site" disabled/>
          <Tab eventKey="Ground_Motion" title="Ground motion" disabled/>

            <Tab eventKey="Analysis_Parameters" title="Analysis parameters">
            <p></p>
            <Form validated onSubmit={this.saveAndContinue} >

              <Row> 
                <Col xs={8}>

                  <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                    <Col sm={{ span: 4, offset: 0 }}><CustomTooltip title="Set Site Reponse Analysis Calculation Method" placement="right" ><Form.Label> <h6>1) Analysis type: </h6></Form.Label></CustomTooltip></Col>
                    <Col sm={{ span: 4, offset: 0 }}>
                            <Form.Control as="select" name= "Analysis_Type" defaultValue={this.props.inputValues.Analysis_Type} required onChange={this.props.handleChange}>
                            <option value="EQL">Equivalent linear</option>
                            {/*<option value="LE">Linear elastic</option>*/}
                          </Form.Control>                      
                    </Col>
                  </Form.Group>

                  {Analysis_Parameters}



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
                                  axisTop={{ orient: 'top', tickSize: 5, tickRotation: -20, legend: 'Shear wave velocity, Vs (m/s)' , legendOffset: -40, legendPosition: 'middle'}}
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
                                  axisTop={{ orient: 'top', tickSize: 5, tickRotation: -20, legend: 'Small-strain damping (%)' , legendOffset: -40, legendPosition: 'middle'}}
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
                <p></p>
              
              <Button variant="secondary" onClick={this.back}>Back</Button>{' '}
              {whether_analyzed ? (<Button variant="primary" type="Submit"><Spinner as="span" animation="border" size="sm" /> Analyze</Button>) : 
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