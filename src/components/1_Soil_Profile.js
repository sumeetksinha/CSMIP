import React, { Component } from 'react';
import {Form, Button, Card, Col, Row, Container, Tabs, Tab } from 'react-bootstrap';
import { AddBox, ArrowDownward } from "@material-ui/icons";
import MaterialTable from "material-table";


class Soil_Profile extends Component{

    back  = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    };

    render() {

        const Reference_Site_Profile = [   { title: "Name", field: "Name", type:"string", align:"center", editable: 'never'},
                                           { title: "Thickness", field: "Thickness", type:"numeric", align:"center", validate: rowData => rowData.Thickness > 0},
                                           { title: "Vs (m/s)", field: "Vs" , type:"numeric", align:"center", validate: rowData => rowData.Vs > 0},
                                           { title: "Unit Weight (kN/m^3)", field: "Gamma", type: "numeric", align:"center", validate: rowData => rowData.Gamma > 0},
                                           { title: "Damping (%)", field: "Damping", type: "numeric", align:"center", validate: rowData => (rowData.Damping <=100 && rowData.Damping >=0)},
                                           { title: "Soil Model", field: "Soil_Model", lookup: { 1: 'EPRI (93), PI=10', 2: 'Seed & Idriss, Sand Mean', 3: 'None' }, align:"center", validate: rowData => rowData.Soil_Model >0}
                                       ];

        return( 

            <Tabs id="CSMIP_Tabs" transition={false}>
            <Tab eventKey="Soil_Profile" title="Reference Site" >
                <p></p>

                <Form validated onSubmit={this.saveAndContinue} validated>
                    <MaterialTable
                        title= "Reference Site Profile"
                        columns={Reference_Site_Profile}
                        data={this.props.inputValues.SoilLayers1}

                        editable={{ 
                            // isEditHidden: rowData => (rowData.Name === 'Bedrock' || rowData.Name === 'Layer 1'),
                            isDeleteHidden: rowData => (rowData.Name === 'Bedrock' || rowData.Name === 'Layer 1'),
                            
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                    const data = this.props.inputValues.SoilLayers1;
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
                                    const data = this.props.inputValues.SoilLayers1;
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
                                    const data = this.props.inputValues.SoilLayers1;
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
                                }
                        }}
                    />

                    <p></p>
                    <Button variant="primary" type="Submit">Next</Button>
                </Form>
  
          
            </Tab>
            <Tab eventKey="Ground_Motion" title="Ground Motion" disabled/>
            <Tab eventKey="Analyze" title="Analysis Settings" disabled/>
            <Tab eventKey="Results" title="Results" disabled/>
        </Tabs>
        );
    }
}

export default Soil_Profile;