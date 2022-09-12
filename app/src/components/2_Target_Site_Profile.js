import React, { Component } from 'react';
import {Form, Button, Card, Col, Row, Container, Tabs, Tab } from 'react-bootstrap';
import { AddBox, ArrowDownward } from "@material-ui/icons";
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

       const data =  this.props.inputValues.FAS

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
                                        // console.log(Layer_1)
                                        // console.log(Bedrock)
                                        // console.log(OtherLayers)
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

                            options={{
                                sorting: false,
                                selection: true,
                                rowStyle: {
                                    backgroundColor: '#EEE',
                                    height: 5,
                                    }
                            }}
                        />
                        </Col>
                        <Col xs={4}>
                            <ResponsiveLine
                              data={data}
                              margin={{ top: 50, right: 0, bottom: 10, left: 70 }}
                              xScale={{ type: 'log', base: 10, max: 'auto' }}
                              // yScale={{ type: 'log', base: 10, max: 'auto' }}
                              axisBottom={{ orient: 'bottom', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Vs (m/s)', legendOffset: 36, legendPosition: 'middle', tickRotation: 0,  tickValues: [0.01, 0.1, 1.0, 10]}}
                              axisTop={{ orient: 'top', tickSize: 5, tickValues: [0.01, 0.1, 1.0, 10], legend: 'Vs (m/s)' , legendOffset: -36, legendPosition: 'middle', tickRotation: 0,  tickValues: [0.01, 0.1, 1.0, 10]}}
                              axisLeft={{ orient: 'left', tickSize: 5,  tickRotation: 0, legend: 'Depth (m)', legendOffset: -60, legendPosition: 'middle',}}
                              // axisRight={{ orient: 'right', tickSize: 5,  tickRotation: 0}}
                              colors={{ scheme: 'category10' }}
                              enablePoints={false}
                              useMesh={true}
                           />
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