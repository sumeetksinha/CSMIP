import React, { Component, useState } from 'react';
import Tab_1 from "./1_Reference_Site_Profile";
import Tab_2 from "./2_Target_Site_Profile";
import Tab_3 from "./3_Ground_Motion";
import Tab_4 from "./4_Analysis_Parameters";
import Tab_5 from "./5_Results";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Kobe_1995    from "./motions/Kobe_1995.json";
import Chi_Chi_1999 from "./motions/Chi_Chi_1999.json";



class Application extends Component {

    constructor(props) {
        super(props)
        // set the initial input values
        this.state = {
            step: 1,             // Current Tab
            Target_Depth:5,      // Depth of Interest
            Tol: 2,              // error tolerance (%)
            MaxIter: 15,         // maximum number of iterations
            EffStrain: 0.65,     // effective strain ratio
            MaxFreq: 20,         // maximum frequency (Hz)
            WavFrac: 0.2,        // wavelength fraction 
            PGA: 0.17,           // peak ground acceleration
            PGV: 13.27,          // peak ground velocity
            Magnitude: 6,        // magnitude of earthquake
            Distance: 30,        // distance from site
            Region: 'wna',       // region
            FASFile: './FAS.txt',// FAS File
            Motion_File: 'Kobe_1995',// FAS File
            FAS: [{"id": "FAS","data": [{"x":0.05, "y":0.01},{"x":1.049, "y":0.0299},{"x":2.048, "y":0.0316},{"x":3.047, "y":0.031},{"x":4.046, "y":0.029},{"x":5.045, "y":0.0264625},{"x":6.044, "y":0.02419},{"x":7.043, "y":0.022034},{"x":8.042, "y":0.01976333},{"x":9.041, "y":0.01773167},{"x":10.04, "y":0.01586},{"x":11.039, "y":0.014222},{"x":12.038, "y":0.012762},{"x":13.037, "y":0.011363},{"x":14.036, "y":0.010264},{"x":15.035, "y":0.009205},{"x":16.034, "y":0.008316},{"x":17.033, "y":0.007467},{"x":18.032, "y":0.0066756},{"x":19.031, "y":0.0059976},{"x":20.03, "y":0.005396},{"x":21.029, "y":0.0047984},{"x":22.028, "y":0.0042688},{"x":23.027, "y":0.00381055},{"x":24.026, "y":0.0034118},{"x":25.025, "y":0.0030225},{"x":26.024, "y":0.0027056},{"x":27.023, "y":0.00240425},{"x":28.022, "y":0.0021556},{"x":29.021, "y":0.0019158},{"x":30.02, "y":0.001706},{"x":31.019, "y":0.00153715},{"x":32.018, "y":0.0013664},{"x":33.017, "y":0.00122245},{"x":34.016, "y":0.0010884},{"x":35.015, "y":0.00097905},{"x":36.014, "y":0.00087088},{"x":37.013, "y":0.00077557},{"x":38.012, "y":0.00069553},{"x":39.011, "y":0.00061897},{"x":40.01, "y":0.00055443},{"x":41.009, "y":0.00049555},{"x":42.008, "y":0.00044196},{"x":43.007, "y":0.00039703},{"x":44.006, "y":0.00035576},{"x":45.005, "y":0.00031815},{"x":46.004, "y":0.0002832},{"x":47.003, "y":0.00025418},{"x":48.002, "y":0.00022595},{"x":49.001, "y":0.00020298},{"x":50, "y":0.000181}]},], // FAS File Contents
            Motion: [{"id": "Ground Motion","color": "hsl(0, 100%, 0%)", "data": [{"x":0,"y":0},{"x":94.14,"y":0}]},{"id": "Input Motion","color": "hsl(0, 100%, 50%)","data": [{"x":0.05, "y":0.01},{"x":50, "y":0.000181}]}], // Motion File Contents

            whether_analyzed:  0, // Whether analysis is performed

            whether_processed: 0, // Whether analysis is performed

            Reference_Site_Soil_Profile: [{Name: 'Layer 1',Thickness: 15, Vs: 500, Gamma: 18, Damping: 0.020, Soil_Model: 3},
                                          {Name: 'Layer 2',Thickness:  5, Vs: 760, Gamma: 20, Damping: 0.010, Soil_Model: 3},
                                          {Name: 'Bedrock',Thickness:  5, Vs: 760, Gamma: 22, Damping: 0.005, Soil_Model: 3}], // Reference_Site_Soil_Profile
            
            Target_Site_Soil_Profile: [{Name: 'Layer 1',Thickness:  5, Vs: 250, Gamma: 18, Damping: 0.020, Soil_Model: 3},
                                       {Name: 'Layer 2',Thickness: 15, Vs: 400, Gamma: 18, Damping: 0.010, Soil_Model: 3},
                                       {Name: 'Bedrock',Thickness:  5, Vs: 760, Gamma: 22, Damping: 0.005, Soil_Model: 3},], // Target_Site_Soil_Profile

            Site_Vs_Profile: [{"id": "Reference","data": [{"x":500, "y":0},{"x":500, "y":15},{"x":760, "y":15},{"x":760, "y":20},{"x":760, "y":20},{"x":760, "y":25}]},{"id": "Target","data": [{"x":250, "y":0},{"x":250, "y":5},{"x":400, "y":5},{"x":400, "y":20},{"x":760, "y":20},{"x":760, "y":25}]},{"id": "Target Depth","data": [{"x":0, "y":5},{"x":760, "y":5}]}], // Reference Vs Profile
            Site_Damping_Profile: [{"id": "Reference","data": [{"x":0.02, "y":0},{"x":0.02, "y":15},{"x":0.01, "y":15},{"x":0.01, "y":20},{"x":0.005, "y":20},{"x":0.005, "y":25}]},{"id": "Target","data": [{"x":0.02, "y":0},{"x":0.02, "y":5},{"x":0.01, "y":5},{"x":0.01, "y":20},{"x":0.005, "y":20},{"x":0.005, "y":25}]},{"id": "Target Depth","data": [{"x":0, "y":5},{"x":0.02, "y":5}]}], // Reference Vs Profile
            
            // Results
            Transfer_Functions:  [{"id": "Reference_Site","data": [{"x" :1, "y":2},{"x" :2, "y":5}]},{"id": "Target_Site","data": [{"x" :1, "y":2},{"x" :2, "y":5}]},{"id": "Reference_to_Target","data": [{"x" :1, "y":2},{"x" :2, "y":5}]}],
        }

        const Motion_Data     = this.state.Motion;
        Motion_Data[0].data   = Kobe_1995.data;
        this.setState({
            Motion : Motion_Data
        })

        // Bind the submission to handleChange() 
        this.handleChange = this.handleChange.bind(this)
    }

    
    // function to update the step by 1
    nextStep = () => {
        const {step} = this.state

        if(step==1) this.Generate_FAS();

        this.setState({
            step : step + 1
        })
        console.log(this.state)

    }

    // function to decrement the step by 1
    prevStep = () => {
        const { step } = this.state
        this.setState({
            step : step - 1
        })
    }
    
    /////////////////////////////////////////////
    // Function to perform analysis when the  
    // analyse button is clicked
    /////////////////////////////////////////////
    Analyze = () => {
        const { step } = this.state
        this.setState({
            whether_analyzed : 1
        })
        fetch('http://localhost:5000/Analyze',
            {
                method: 'POST',
                mode: 'cors',
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            }
        )
        .then(response => response.json())
        .then(json => {
            console.log(json);
            this.setState({
                whether_analyzed : json.whether_analyzed,
                Transfer_Functions : json.Transfer_Functions
            })
            console.log(this.state);

            if (this.state.whether_analyzed == 2){

                this.Generate_Motion();
                this.setState({
                    step : step + 1,
                    whether_analyzed : 0
                })
            }

        })
        .catch(error => console.log(error));
    }

    /////////////////////////////////////////////
    // Function to create the FAS inout based on 
    // the input properties from user
    /////////////////////////////////////////////
    Generate_FAS = () => {

        const { step } = this.state
        console.log(this.state)

        this.setState({whether_analyzed : 1})

        fetch('http://localhost:5000/Generate_FAS',
            {
                method: 'POST',
                mode: 'cors',
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            }
        )
        .then(response => response.json())
        .then(json => {
            console.log(json);
            this.setState({
                whether_analyzed : json.whether_analyzed,
                FAS : json.FAS,
            })
            console.log(this.state);

            if (this.state.whether_analyzed == 2){
                this.setState({
                    whether_analyzed : 0
                })
            }           
        })
        .catch(error => console.log(error));
    }

    /////////////////////////////////////////////
    // Function to generate input motion from 
    // the given ground motion   
    /////////////////////////////////////////////
    Generate_Motion = () => {
        const { step } = this.state
        this.setState({
            whether_processed : 1
        })
        fetch('http://localhost:5000/Generate_Motion',
            {
                method: 'POST',
                mode: 'cors',
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            }
        )
        .then(response => response.json())
        .then(json => {
            console.log(json);
            this.setState({
                whether_processed : json.whether_processed,
                Motion : json.Motion
            })
            console.log(this.state);

            if (this.state.whether_processed == 2){
                this.setState({
                    whether_processed : 0
                })
            }           
        })
        .catch(error => console.log(error));
    }

    // function to handle update of values in form 
    handleChange = (event) => {
        const inputName  = event.target.name;
        const inputValue = event.target.value;

        // run the validation here 
        this.setState({[inputName]:inputValue});

        if(inputName=="Target_Depth"){
            this.update_Target_Depth_Plots(inputValue)
        }

        if(inputName=="Motion_File"){

            const Motion_Data     = this.state.Motion

            if(inputValue=="Kobe_1995")
                Motion_Data[0].data=Kobe_1995.data;
            if(inputValue=="Chi_Chi_1999")
                Motion_Data[0].data=Chi_Chi_1999.data;

            this.Generate_Motion();
        }

    }

   // function to handle upload of FAS file
    handleFile = (event) => {

        const inputName  = event.target.name;
        const inputValue = event.target.value;

        const reader = new FileReader()
        let file_content =""

        reader.onload = function(event) {  
            const file_data_array =  reader.result.split(/\r?\n/);
            const FAS_Data = this.state.FAS

            let n = file_data_array.length;
            var FAS_Data_Array  = [];
            var FAS_Data_Points = {};

            for (let i = 0; i < n; i++){
                let data = file_data_array[i].split(",");
                FAS_Data_Points.y = data[1];
                FAS_Data_Points.x = data[0];
                FAS_Data_Array.push({...FAS_Data_Points});
            }

            FAS_Data[0].data = FAS_Data_Array;
            this.setState({FAS:FAS_Data});

        }.bind(this);

        var file = event.target.files[0]; 
        reader.readAsText(file)

        // try{
        //    reader.readAsText(file)
        // }catch(error){
        //     console.log("Error")
        //     alert("Failed to read file");
        // }
    }

    //////////////////////////////////////////////////////////////////
    // Function to read motion file
    //////////////////////////////////////////////////////////////////
    readMotionFile = (event) => {

        const reader = new FileReader()
        let file_content =""

        reader.onload = function(event) {  
            const file_data_array =  reader.result.split(/\r?\n/);
            const Motion_Data     = this.state.Motion

            let n = file_data_array.length;
            var Motion_Data_Array  = [];
            var Motion_Data_Points = {};
            var dt = file_data_array[0].split(",")[0];

            for (let i = 1; i < n; i++){
                let data = file_data_array[i].split(",");
                Motion_Data_Points.y = data[0];
                Motion_Data_Points.x = (i-1)*dt;
                Motion_Data_Array.push({...Motion_Data_Points});
            }

            Motion_Data[0].data = Motion_Data_Array;
            this.setState({Motion:Motion_Data});

            this.Generate_Motion();

        }.bind(this);

        var file = event.target.files[0]; 

        console.log(event.target.files[0])
        reader.readAsText(file)



        // try{
        //    reader.readAsText(file)
        // }catch(error){
        //     console.log("Error")
        //     alert("Failed to read file");
        // }
    }

    //////////////////////////////////////////////////////////////////
    // Read the Excel Profile data
    //////////////////////////////////////////////////////////////////
    readExcelProfileData = (event) => {

        // get the id and input value
        const inputName  = event.target.name;
        const inputValue = event.target.value;

        const reader = new FileReader()
        let file_content =""

        reader.onload = function(event) {  

            const bstr = event.target.result;
            const workbook = XLSX.read(bstr, { type: "binary" });

            var worksheetName = workbook.SheetNames[0];

            console.log(workbook.SheetNames)

            if(workbook.SheetNames.length>1){
                if(inputName=="ReferenceDataFile") worksheetName='Reference';
                if(inputName=="TargetDataFile") worksheetName='Target';
            }

            // console.log(worksheetName)

            const worksheet  = workbook.Sheets[worksheetName];

            const data_array = XLSX.utils.sheet_to_csv(worksheet, { header: 1 }).split(/\r?\n/);

            console.log(data_array[1]);

            let n = data_array.length;
            var Site_Soil_Profile_Data_Array  = [];
            var Site_Soil_Profile_Data_Points = {};

            for (let i = 1; i < n; i++){
                let data = data_array[i].split(",");
                Site_Soil_Profile_Data_Points.Name      = data[0];
                Site_Soil_Profile_Data_Points.Thickness = parseFloat(data[1]);
                Site_Soil_Profile_Data_Points.Vs        = parseFloat(data[2]);
                Site_Soil_Profile_Data_Points.Gamma     = parseFloat(data[3]);
                Site_Soil_Profile_Data_Points.Damping   = parseFloat(data[4]);
                Site_Soil_Profile_Data_Points.Soil_Model= 3;
                Site_Soil_Profile_Data_Array.push({...Site_Soil_Profile_Data_Points});
            }

            // console.log(inputName)

            if(inputName=="ReferenceDataFile"){
                this.setState({Reference_Site_Soil_Profile:Site_Soil_Profile_Data_Array});
                this.update_Reference_Site_Profile_Plots();
            }
            if(inputName=="TargetDataFile"){
                this.setState({Target_Site_Soil_Profile:Site_Soil_Profile_Data_Array});
                this.update_Target_Site_Profile_Plots();
            }
            this.update_Target_Depth_Plots(this.state.Target_Depth);

        }.bind(this);

        // get the excel file
        var file = event.target.files[0]; 
        reader.readAsBinaryString(file);
    }


    //////////////////////////////////////////////////////////////////
    // Read the Excel Profile data
    //////////////////////////////////////////////////////////////////
    writeExcelProfileData = (event) => {

        // get the id and input value
        const inputName  = event.target.name;
        const inputValue = event.target.value;

        // create a new XLSX file
        var wb = XLSX.utils.book_new();

        // update properties of the file
        wb.Props = {
                Title: "CSMIP App",
                Subject: "Profile",
                Author: "Sumeet Kumar Sinha",
                CreatedDate: new Date()
        };

        var ws = XLSX.utils.json_to_sheet(this.state.Reference_Site_Soil_Profile);
        XLSX.utils.book_append_sheet(wb,ws,"Reference");

        var ws = XLSX.utils.json_to_sheet(this.state.Target_Site_Soil_Profile);
        XLSX.utils.book_append_sheet(wb,ws,"Target");

        XLSX.writeFile(wb,"SoilProfile.xlsx");
    }

    //////////////////////////////////////////////////////////////////
    // Read the Excel Profile data
    //////////////////////////////////////////////////////////////////
    downloadInputMotionFile = (event) => {

        // get the id and input value
        const inputName  = event.target.name;
        const inputValue = event.target.value;

        const Input_Motion_Data = this.state.Motion[1]["data"];
        var dt = Input_Motion_Data[1].x - Input_Motion_Data[0].x;

        var data = dt.toString()+"\n";
        var n = Input_Motion_Data.length;

        for (let i = 0; i < n; i++){
            data=data+Input_Motion_Data[i].y+"\n"
        }

      var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "InputMotion.txt");

    }

    //////////////////////////////////////////////////////////////////
    // Update Target Depth Plot
    //////////////////////////////////////////////////////////////////
    update_Target_Depth_Plots=(Target_Depth)=>{

        const Site_Vs_Profile_Data      = this.state.Site_Vs_Profile;
        const Site_Damping_Profile_Data = this.state.Site_Damping_Profile;
        const Vs_Profile_Data = Site_Vs_Profile_Data[0].data.concat(Site_Vs_Profile_Data[1].data)

        var maxValue = Math.max.apply(null,Vs_Profile_Data.map(function(o) { return o.x; }));
        var minValue = Math.min.apply(null,Vs_Profile_Data.map(function(o) { return o.x; }));

        var Target_Depth_Vs_Data  = [{"x":minValue,"y":Target_Depth},{"x":maxValue,"y":Target_Depth}];
        var Target_Depth_Damping_Data  = [{"x":0,"y":Target_Depth},{"x":1.0,"y":Target_Depth}];

        // update Vs and Damping profile arrays
        Site_Vs_Profile_Data[2].data = Target_Depth_Vs_Data;
        Site_Damping_Profile_Data[2].data = Target_Depth_Damping_Data;

        // update the state 
        this.setState({Site_Vs_Profile:Site_Vs_Profile_Data});
        this.setState({Site_Damping_Profile:Site_Damping_Profile_Data});
    }

    //////////////////////////////////////////////////////////////////
    // Update the Reference Site Profile Plot
    //////////////////////////////////////////////////////////////////
    update_Reference_Site_Profile_Plots(){

        // get the shear wave velocity, damping and refernce site soil profile from the current state
        const Site_Vs_Profile_Data      = this.state.Site_Vs_Profile
        const Site_Damping_Profile_Data = this.state.Site_Damping_Profile
        const Reference_Site_Profile    = this.state.Reference_Site_Soil_Profile;

        // calculate the number of layers
        let Reference_Site_Num_Layers = Reference_Site_Profile.length;

        // declare variables for Vs and Damping arrays
        var Reference_Site_Vs_Data    = [];
        var Reference_Site_Damping_Data  = [];

        // declare variable for Vs and Damping data points
        var Vs_Data = {};
        var Damping_Data = {};

        // start with an initial depth =0
        var depth = 0;

        // To print message in console
        // console.log(JSON.stringify(Reference_Site_Num_Layers));

        // Loop over the layers
        for (let i = 0; i < Reference_Site_Num_Layers; i++) {

            Vs_Data.y = depth;
            Vs_Data.x = Reference_Site_Profile[i].Vs;
            Reference_Site_Vs_Data.push({...Vs_Data});

            Damping_Data.y = depth;
            Damping_Data.x = Reference_Site_Profile[i].Damping;
            Reference_Site_Damping_Data.push({...Damping_Data});

            depth = depth + Reference_Site_Profile[i].Thickness

            Vs_Data.y = depth;
            Vs_Data.x = Reference_Site_Profile[i].Vs;
            Reference_Site_Vs_Data.push({...Vs_Data});

            Damping_Data.y = depth;
            Damping_Data.x = Reference_Site_Profile[i].Damping;
            Reference_Site_Damping_Data.push({...Damping_Data});
        }

        // update Vs and Damping profile arrays
        Site_Vs_Profile_Data[0].data = Reference_Site_Vs_Data;
        Site_Damping_Profile_Data[0].data = Reference_Site_Damping_Data;

        // update the state 
        this.setState({Site_Vs_Profile:Site_Vs_Profile_Data});
        this.setState({Site_Damping_Profile:Site_Damping_Profile_Data});
    }


    //////////////////////////////////////////////////////////////////
    // Update the Target Site Profile Plot
    //////////////////////////////////////////////////////////////////
    update_Target_Site_Profile_Plots(){

        // get the shear wave velocity, damping and refernce site soil profile from the current state
        const Site_Vs_Profile_Data      = this.state.Site_Vs_Profile
        const Site_Damping_Profile_Data = this.state.Site_Damping_Profile
        const Target_Site_Profile    = this.state.Target_Site_Soil_Profile;

        // calculate the number of layers
        let Target_Site_Num_Layers = Target_Site_Profile.length;

        // declare variables for Vs and Damping arrays
        var Target_Site_Vs_Data    = [];
        var Target_Site_Damping_Data  = [];

        // declare variable for Vs and Damping data points
        var Vs_Data = {};
        var Damping_Data = {};

        // start with an initial depth =0
        var depth = 0;

        // To print message in console
        // console.log(JSON.stringify(Target_Site_Num_Layers));

        // Loop over the layers
        for (let i = 0; i < Target_Site_Num_Layers; i++) {

            Vs_Data.y = depth;
            Vs_Data.x = Target_Site_Profile[i].Vs;
            Target_Site_Vs_Data.push({...Vs_Data});

            Damping_Data.y = depth;
            Damping_Data.x = Target_Site_Profile[i].Damping;
            Target_Site_Damping_Data.push({...Damping_Data});

            depth = depth + Target_Site_Profile[i].Thickness

            Vs_Data.y = depth;
            Vs_Data.x = Target_Site_Profile[i].Vs;
            Target_Site_Vs_Data.push({...Vs_Data});

            Damping_Data.y = depth;
            Damping_Data.x = Target_Site_Profile[i].Damping;
            Target_Site_Damping_Data.push({...Damping_Data});
        }

        // update Vs and Damping profile arrays
        Site_Vs_Profile_Data[1].data = Target_Site_Vs_Data;
        Site_Damping_Profile_Data[1].data = Target_Site_Damping_Data;

        // update the state 
        this.setState({Site_Vs_Profile:Site_Vs_Profile_Data});
        this.setState({Site_Damping_Profile:Site_Damping_Profile_Data});
    }

    //////////////////////////////////////////////////////////////////
    // Update the properties of Reference Site Profile
    //////////////////////////////////////////////////////////////////
    update_Reference_Site_Soil_Profile = (newData) => {

        // update the state to new Reference Site Profile 
        this.setState({Reference_Site_Soil_Profile:newData});
        this.update_Reference_Site_Profile_Plots();
        this.update_Target_Depth_Plots(this.state.Target_Depth);
    }

    //////////////////////////////////////////////////////////////////
    // Update the properties of Target Site Profile
    //////////////////////////////////////////////////////////////////
    update_Target_Site_Soil_Profile = (newData) => {

        // update the state to new Target Site Profile 
        this.setState({Target_Site_Soil_Profile:newData});
        this.update_Target_Site_Profile_Plots();
        this.update_Target_Depth_Plots(this.state.Target_Depth);
    }

    render(){
        const { step, Tol, MaxIter,  EffStrain, MaxFreq, WavFrac, PGA, PGV, Magnitude, Distance, Region, FASFile, FAS, Target_Depth, whether_analyzed, Reference_Site_Soil_Profile, Site_Vs_Profile, Site_Damping_Profile, Target_Site_Soil_Profile, Transfer_Functions, Motion_File,Motion,whether_processed} = this.state;
        const inputValues = { Tol, MaxIter, EffStrain, MaxFreq, WavFrac, PGA, PGV, Magnitude, Distance, Region, FASFile, FAS, Target_Depth, whether_analyzed, Reference_Site_Soil_Profile, Site_Vs_Profile, Site_Damping_Profile, Target_Site_Soil_Profile, Transfer_Functions, Motion_File,Motion,whether_processed};
               
        switch(step) {
        case 1:
            return <Tab_1
                    nextStep                  = {this.nextStep}
                    updateSoilLayers          = {this.update_Reference_Site_Soil_Profile}
                    readSoilProfileData       = {this.readExcelProfileData}
                    downloadSoilProfileData   = {this.writeExcelProfileData}
                    inputValues={inputValues}
                    />
        case 2:
            return <Tab_2
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    updateSoilLayers = {this.update_Target_Site_Soil_Profile}
                    readSoilProfileData   = {this.readExcelProfileData}
                    downloadSoilProfileData   = {this.writeExcelProfileData}
                    handleChange = {this.handleChange}
                    inputValues={inputValues}
                    />
        case 3:
            return <Tab_3
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleFile = {this.handleFile}
                    handleChange = {this.handleChange}
                    inputValues={inputValues}
                    Generate_FAS={this.Generate_FAS}
                    />
        case 4:
            return <Tab_4
                nextStep={this.Analyze}
                prevStep={this.prevStep}
                inputValues={inputValues}
                handleChange = {this.handleChange}
                />
        case 5:
            return <Tab_5
                // nextStep={this.Analyze}
                prevStep={this.prevStep}
                inputValues={inputValues}
                handleChange = {this.handleChange}
                handleFile = {this.readMotionFile}
                downloadFile = {this.downloadInputMotionFile}
                />
        }
    }
}

export default Application;