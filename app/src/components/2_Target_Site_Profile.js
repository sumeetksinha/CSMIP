import React, { Component } from 'react';
import {Form, Button, Card, Col, Row, Container, Tabs, Tab } from 'react-bootstrap';
import {AddBox, ArrowDownward, ArrowUpward, CloudUpload, CloudDownload } from "@material-ui/icons";
import MaterialTable from "material-table";
import { ResponsiveLine } from '@nivo/line'


class Target_Site extends Component{

    back  = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    };

    render() {

        const Soil_Profile_Table = [   { title: "Name", field: "Name", type:"string", align:"center", editable: 'never'},
                                           { title: "Thickness (m)", field: "Thickness", type:"numeric", align:"center", validate: rowData => rowData.Thickness > 0},
                                           { title: "Vs (m/s)", field: "Vs" , type:"numeric", align:"center", validate: rowData => rowData.Vs > 0},
                                           { title: "Unit Weight (kN/m^3)", field: "Gamma", type: "numeric", align:"center", validate: rowData => rowData.Gamma > 0},
                                           { title: "Damping (%)", field: "Damping", type: "numeric", align:"center", validate: rowData => (rowData.Damping <=100 && rowData.Damping >=0)},
                                           { title: "Soil Model", field: "Soil_Model", lookup: { 1: 'EPRI (93), PI=10', 2: 'Seed & Idriss, Sand Mean', 3: 'None' }, align:"center", validate: rowData => rowData.Soil_Model >0}
                                       ];

        return( 

            <Tabs id="CSMIP_Tabs" activeKey="Target_Site" transition={false}>
            <Tab eventKey="Reference_Site" title="Reference Site" disabled />
            <Tab eventKey="Target_Site" title="Target Site" >
                <p></p>
                <Form onSubmit={this.saveAndContinue} validated>
                    <Row> <Col xs={8}>
                        <MaterialTable
                            title= "Soil Profile"
                            style={{ height: "100%" }}
                            columns={Soil_Profile_Table}
                            data={this.props.inputValues.Target_Site_Soil_Profile}

                            editable={{ 
                                // isEditHidden: rowData => (rowData.Name === 'Bedrock' || rowData.Name === 'Layer 1'),
                                isDeleteHidden: rowData => (rowData.Name === 'Bedrock' || rowData.Name === 'Layer 1'),
                                
                                onRowAdd: newData =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const data = this.props.inputValues.Target_Site_Soil_Profile;
                                        const Layer_1 = data.slice(0,1);
                                        const Bedrock = data.slice(-1);
                                        const OtherLayers = data.slice(1,-1);
                                        newData.Thickness=parseFloat(newData.Thickness);
                                        newData.Vs=parseFloat(newData.Vs);
                                        newData.Gamma=parseFloat(newData.Gamma);
                                        newData.Damping=parseFloat(newData.Damping);
                                        // console.log(Layer_1)
                                        // console.log(Bedrock)
                                        // console.log("I am here")
                                        newData.Name = "Layer " + (data.length)
                                        this.props.handleChange([...Layer_1, ...OtherLayers, newData, ...Bedrock])
                                        resolve();
                                        }, 10)
                                }),

                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const data = this.props.inputValues.Target_Site_Soil_Profile;
                                        const dataUpdate = [...data];
                                        const index = oldData.tableData.id;
                                        newData.Thickness=parseFloat(newData.Thickness)
                                        newData.Vs=parseFloat(newData.Vs)
                                        newData.Gamma=parseFloat(newData.Gamma)
                                        newData.Damping=parseFloat(newData.Damping)
                                        dataUpdate[index] = newData;
                                        this.props.handleChange([...dataUpdate]);
                                        resolve();
                                        }, 10)
                                }),

                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const data = this.props.inputValues.Target_Site_Soil_Profile;
                                        const dataDelete = [...data];
                                        const index = oldData.tableData.id;
                                        dataDelete.splice(index, 1);
                                        this.props.handleChange([...dataDelete])
                                        resolve();
                                        }, 10)
                                }),

                            }}

                            actions={[
                                {icon:()=>  
                                    <label> <font color="blue" size="+1.5"> <b>Target Depth (m)</b>  </font><input type="text" name="name" size="1" height="20px" value="0" /></label>,
                                    isFreeAction:true,
                                },
                                {icon:()=>  <div>
                                              <label for="file-input"><CloudUpload/></label>
                                              <input id="file-input" accept=".txt" hidden type="file" />
                                            </div>,

                                    tooltip:"Import",
                                    onclick:()=>alert("clicked"),
                                    isFreeAction:true,
                                },
                                {icon:()=>  <div>
                                              <label for="file-input"><CloudDownload/></label>
                                              <input id="file-input" accept=".txt" hidden type="file" />
                                            </div>,

                                    tooltip:"Import",
                                    onclick:()=>alert("clicked"),
                                    isFreeAction:true,
                                },
                                ]}

                            options={{
                                sorting: false,
                                selection: false,
                                search: false,
                                rowStyle: {
                                    backgroundColor: '#EEE',
                                    height: 5,
                                    },
                                fixedColumns: {
                                        left: 0, 
                                        right: 0
                                      },
                                exportButton: false
                            }}
                            
                        />
{/*
                      <Form.Group as={Row} controlId="Date">
                        <Col sm={{ span: 3, offset: 0 }}><Form.Label> &nbsp;&nbsp; Depth of Interest </Form.Label></Col>
                        <Col sm={{ span: 2, offset: 0 }}><Form.Control type="text" name = "Depth_of_Interest" defaultValue={this.props.inputValues.Depth_of_Interest} required onChange={this.props.handleChange}/></Col>
                      </Form.Group>*/}

{/*                    <Form validated onSubmit={this.saveAndContinue} validated>
                      <Form.Group as={Row} controlId="Date">
                        <Col sm={{ span: 3, offset: 0 }}><Form.Label> &nbsp;&nbsp; Depth of Interest </Form.Label></Col>
                        <Col sm={{ span: 2, offset: 0 }}><Form.Control type="text" name = "Depth_of_Interest" defaultValue={this.props.inputValues.Depth_of_Interest} required onChange={this.props.handleChange}/></Col>
                      </Form.Group>
                    </Form>*/}


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
                                                    direction: 'row',
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
                                                    direction: 'row',
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
            <Tab eventKey="Ground_Motion" title="Ground Motion" disabled/>
            <Tab eventKey="Analyze" title="Analysis" disabled/>
            <Tab eventKey="Results" title="Results" disabled/>
        </Tabs>
        );
    }
}

export default Target_Site;