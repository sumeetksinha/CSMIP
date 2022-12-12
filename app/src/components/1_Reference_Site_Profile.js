import React, { Component } from 'react';
import {Form, Button, Col, Row, Tabs, Tab } from 'react-bootstrap';
import {CloudUpload, CloudDownload } from "@material-ui/icons";
import MaterialTable from "material-table";
import { ResponsiveLine } from '@nivo/line';
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

class Reference_Site extends Component{

    back  = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    };

    render() {

        const Soil_Profile_Table = [   { title: "Layer", field: "Name", type:"string", align:"center", editable: 'never'},
                                           { title: "H (m)", field: "Thickness", type:"numeric", align:"center", initialEditValue:5, validate: rowData => rowData.Thickness > 0},
                                           { title: <h7>V<sub>S </sub>(m/s)</h7>, field: "Vs" , type:"numeric", align:"center", initialEditValue:100, validate: rowData => rowData.Vs > 0},
                                           { title: <h7>γ<sub>sat </sub>(kN/m<sup>3</sup>)</h7>, field: "Gamma", type: "numeric", align:"center", initialEditValue:20, validate: rowData => rowData.Gamma > 0},
                                           { title: "PI", field: "PI", type: "numeric", align:"center", initialEditValue:0, validate: rowData => rowData.PI >= 0},
                                           { title: "OCR", field: "OCR", type: "numeric", align:"center", initialEditValue:1, validate: rowData => rowData.OCR >= 1},
                                           { title: "Damping (%)", field: "Damping", type: "numeric", align:"center", initialEditValue:0.02, validate: rowData => (rowData.Damping <=1 && rowData.Damping >=0)},
                                           { title: "Soil model", field: "SoilModel", lookup: { 1: 'Elastic', 2: 'Darendeli' }, align:"center", initialEditValue:1, validate: rowData => rowData.SoilModel >0}
                                       ];

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

            <Tabs id="CSMIP_Tabs" activeKey="Reference_Site" transition={false}>
            <Tab eventKey="Reference_Site" title="Reference site" >
                <p></p>

                <Form onSubmit={this.saveAndContinue} validated>
                    <Row> <Col xs={8}>
                        <Row>
                        <MaterialTable
                            title= "1) Soil profile:"
                            style={{ height: "100%" }}
                            columns={Soil_Profile_Table}
                            data={this.props.inputValues.Reference_Site_Soil_Profile}

                            editable={{

                                isDeleteHidden: rowData => (rowData.Name === '1'),
                                
                                onRowAdd: newData =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const data = this.props.inputValues.Reference_Site_Soil_Profile;
                                        const OtherLayers = data.slice(0,data.Length);
                                        newData.Thickness=parseFloat(newData.Thickness);
                                        newData.Vs=parseFloat(newData.Vs);
                                        newData.Gamma=parseFloat(newData.Gamma);
                                        newData.Damping=parseFloat(newData.Damping);
                                        newData.PI=parseFloat(newData.PI);
                                        newData.OCR=parseFloat(newData.OCR);
                                        // console.log(OtherLayers)
                                        // console.log(newData)
                                        // // console.log("I am here")
                                        newData.Name = (data.length)+1
                                        this.props.updateSoilLayers([...OtherLayers, newData])
                                        resolve();
                                        }, 10)
                                }),

                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const data = this.props.inputValues.Reference_Site_Soil_Profile;
                                        const dataUpdate = [...data];
                                        const index = oldData.tableData.id;
                                        newData.Thickness=parseFloat(newData.Thickness)
                                        newData.Vs=parseFloat(newData.Vs)
                                        newData.Gamma=parseFloat(newData.Gamma)
                                        newData.Damping=parseFloat(newData.Damping)
                                        newData.PI=parseFloat(newData.PI);
                                        newData.OCR=parseFloat(newData.OCR);
                                        dataUpdate[index] = newData;
                                        // console.log(newData)
                                        this.props.updateSoilLayers([...dataUpdate]);
                                        resolve();
                                        }, 10)
                                }),

                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const data = this.props.inputValues.Reference_Site_Soil_Profile;
                                        const dataDelete = [...data];
                                        const index = oldData.tableData.id;
                                        dataDelete.splice(index, 1);
                                        this.props.updateSoilLayers([...dataDelete])
                                        resolve();
                                        }, 10)
                                }),

                            }}

                            actions={[
                                {icon:()=>  <div>
                                              <label for="file-input"><CloudUpload/></label>
                                              <input id="file-input" name= "ReferenceDataFile" accept=".xlsx" hidden type="file" onChange={this.props.readSoilProfileData} />
                                            </div>,
                                    tooltip:"Import Data",
                                    onclick:()=>alert("clicked"),
                                    isFreeAction:true,
                                },
                                {icon:()=>  <div>
                                              <label for="download"><CloudDownload/></label>
                                              <Button id ="download" name="ReferenceDataFile" variant="primary" hidden onClick={this.props.downloadSoilProfileData} ></Button>
                                            </div>,

                                    tooltip:"Download Data",
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
                                exportButton: false,
                                maxBodyHeight: 400,
                                pageSizeOptions: [5, 10, 100, 1000]
                            }}

                            localization={{
                                header: {
                                  actions: "Edit"
                                }
                              }}                    

                        />
                        </Row>
                        <Row>
                            <div>
                                <br/>
                                <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                                    <Col xs={4}><Form.Label> <h6> 2) Water table depth (m)</h6> </Form.Label></Col>
                                    <Col xs={2}><Form.Control type="text" name = "Ref_Water_Table_Depth" defaultValue={this.props.inputValues.Ref_Water_Table_Depth} required onChange={this.props.handleChange}/></Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="Date" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                                  <Col xs={2}><Form.Label> <h6> 3) Halfsapce: </h6> </Form.Label></Col>
                                  <Col xs={2}><CustomTooltip title="Halfspace shear wave velocity" placement="bottom" ><Form.Label> V<sub>S</sub> (m/s) </Form.Label></CustomTooltip></Col>
                                  <Col xs={2}><Form.Control type="text" name = "Ref_Halfspace_Vs" defaultValue={this.props.inputValues.Ref_Halfspace_Vs} required onChange={this.props.handleChange}/></Col>
                                  <Col xs={2}><CustomTooltip title="Halfspace damping" placement="bottom" ><Form.Label>Damping (%) </Form.Label></CustomTooltip></Col>
                                  <Col xs={2}><Form.Control type="text" name = "Ref_Halfspace_Damping" defaultValue={this.props.inputValues.Ref_Halfspace_Damping} required onChange={this.props.handleChange}/></Col>
                                </Form.Group>                          
                            </div>
                        </Row>

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
                                          enablePoints={false}
                                          useMesh={true}
                                          colors={{ datum: 'color' }}

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
                    <Button variant="primary" type="Submit">Next</Button>
                </Form>
  
          
            </Tab>
            <Tab eventKey="Target_Site" title="Target site" disabled/>
            <Tab eventKey="Ground_Motion" title="Ground  motion" disabled/>
            <Tab eventKey="Analysis_Parameters" title="Analysis parameters" disabled/>
            <Tab eventKey="Results" title="Results" disabled/>
        </Tabs>
        );
    }
}

export default Reference_Site;