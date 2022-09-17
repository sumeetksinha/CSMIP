import React, { Component, useState } from 'react';
import Tab_1 from "./1_Reference_Site_Profile";
import Tab_2 from "./2_Target_Site_Profile";
import Tab_3 from "./3_Ground_Motion";
import Tab_4 from "./4_Analysis_Settings";
import Tab_5 from "./5_Results";
import * as XLSX from "xlsx";


class Application extends Component {

    constructor(props) {
        super(props)
        // set the initial input values
        this.state = {
            step: 1,
            Target_Depth:15,     // Depth of Interest
            Tol: 2,              // error tolerance (%)
            MaxIter: 15,         // maximum number of iterations
            EffStrain: 0.65,     // effective strain ratio
            MaxFreq: 20,         // maximum frequency (Hz)
            WavFrac: 0.2,        // wavelength fraction 
            PGA: 0.17,           // peak ground acceleration
            PGV: 13.27,          // peak ground velocity
            Magnitude: 6,        // magnitude of earthquake
            Distance: 30,       // distance from site
            Region: 'wna',      // region
            FASFile: './FAS.txt',// FAS File
            FAS: [{"id": "FAS","data": [{"x":0.05, "y":0.01},{"x":1.049, "y":0.0299},{"x":2.048, "y":0.0316},{"x":3.047, "y":0.031},{"x":4.046, "y":0.029},{"x":5.045, "y":0.0264625},{"x":6.044, "y":0.02419},{"x":7.043, "y":0.022034},{"x":8.042, "y":0.01976333},{"x":9.041, "y":0.01773167},{"x":10.04, "y":0.01586},{"x":11.039, "y":0.014222},{"x":12.038, "y":0.012762},{"x":13.037, "y":0.011363},{"x":14.036, "y":0.010264},{"x":15.035, "y":0.009205},{"x":16.034, "y":0.008316},{"x":17.033, "y":0.007467},{"x":18.032, "y":0.0066756},{"x":19.031, "y":0.0059976},{"x":20.03, "y":0.005396},{"x":21.029, "y":0.0047984},{"x":22.028, "y":0.0042688},{"x":23.027, "y":0.00381055},{"x":24.026, "y":0.0034118},{"x":25.025, "y":0.0030225},{"x":26.024, "y":0.0027056},{"x":27.023, "y":0.00240425},{"x":28.022, "y":0.0021556},{"x":29.021, "y":0.0019158},{"x":30.02, "y":0.001706},{"x":31.019, "y":0.00153715},{"x":32.018, "y":0.0013664},{"x":33.017, "y":0.00122245},{"x":34.016, "y":0.0010884},{"x":35.015, "y":0.00097905},{"x":36.014, "y":0.00087088},{"x":37.013, "y":0.00077557},{"x":38.012, "y":0.00069553},{"x":39.011, "y":0.00061897},{"x":40.01, "y":0.00055443},{"x":41.009, "y":0.00049555},{"x":42.008, "y":0.00044196},{"x":43.007, "y":0.00039703},{"x":44.006, "y":0.00035576},{"x":45.005, "y":0.00031815},{"x":46.004, "y":0.0002832},{"x":47.003, "y":0.00025418},{"x":48.002, "y":0.00022595},{"x":49.001, "y":0.00020298},{"x":50, "y":0.000181}]},], // FAS File Contents
            AccelTransferFunctionOutput:[{"id": "AccelTransferFunctionOutput","data": [{"x" :1, "y":2},{"x" :2, "y":5}]},], // AccelTransferFunctionOutput at depth of interest
            whether_analyzed: 0, // Whether analysis is performed
            ResultsFile: [{"id": "FAS","data": [{"x" :1, "y":2},{"x" :2, "y":5}]},],

            Reference_Site_Soil_Profile: [{Name: 'Layer 1',Thickness: 10, Vs: 150, Gamma: 18, Damping: 0.5, Soil_Model: 3},
                          {Name: 'Layer 2',Thickness: 20, Vs: 250, Gamma: 20, Damping: 0.5, Soil_Model: 3},
                          {Name: 'Layer 3',Thickness: 20, Vs: 100, Gamma: 18, Damping: 0.5, Soil_Model: 3},
                          {Name: 'Layer 4',Thickness: 20, Vs: 100, Gamma: 20, Damping: 0.5, Soil_Model: 3},
                          {Name: 'Bedrock',Thickness: 20, Vs: 760, Gamma: 22, Damping: 1, Soil_Model: 3},], // Reference_Site_Soil_Profile

            Site_Vs_Profile: [{"id": "Reference","data": [{"x":150, "y":0},{"x":150, "y":10},{"x":250, "y":10},{"x":250, "y":30},{"x":100, "y":30},{"x":100, "y":50},{"x":100, "y":50},{"x":100, "y":70},{"x":760, "y":70},{"x":760, "y":90}]},{"id": "Target","data": [{"x":20, "y":0},{"x":20, "y":10},{"x":700, "y":10},{"x":700, "y":90}]},{"id": "Target Depth","data": [{"x":0, "y":15},{"x":760, "y":15}]}], // Reference Vs Profile
            Site_Damping_Profile: [{"id": "Reference","data": [{"x":0.5, "y":0},{"x":0.5, "y":10},{"x":0.5, "y":10},{"x":0.5, "y":30},{"x":0.5, "y":30},{"x":0.5, "y":50},{"x":0.5, "y":50},{"x":0.5, "y":70},{"x":0.8, "y":70},{"x":0.8, "y":90}]},{"id": "Target","data": [{"x":.2, "y":0},{"x":.2, "y":10},{"x":.2, "y":10},{"x":.2, "y":90}]},{"id": "Target Depth","data": [{"x":0, "y":15},{"x":1, "y":15}]}], // Reference Vs Profile
            Target_Site_Soil_Profile: [{Name: 'Layer 1',Thickness: 10, Vs: 20, Gamma: 20, Damping: 0.1, Soil_Model: 3},
                         {Name: 'Bedrock',Thickness: 80, Vs: 700, Gamma: 20, Damping: 0.1, Soil_Model: 3},], // Target_Site_Soil_Profile
        }

        // Bind the submission to handleChange() 
        this.handleChange = this.handleChange.bind(this)
    }

    
    // function to update the step by 1
    nextStep = () => {
        const { step } = this.state
        this.setState({
            step : step + 1
        })
        console. log(this.state)

    }

    // function to decrement the step by 1
    prevStep = () => {
        const { step } = this.state
        this.setState({
            step : step - 1
        })
    }
    
    // function when analyze button is clicked
    Analyze = () => {
        const { step } = this.state
        this.setState({
            whether_analyzed : 1
        })
        fetch('http://localhost:5000/analyze',
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
            console. log(json);
            this.setState({
                whether_analyzed : json.whether_analyzed,
                AccelTransferFunctionOutput : json.AccelTransferFunctionOutput,
                ResultsFile : json.ResultsFile
            })
            console. log(this.state);

            if (this.state.whether_analyzed == 2){
                this.setState({
                    step : step + 1,
                    whether_analyzed : 0
                })
            }           
        })
        .catch(error => console. log(error));
    }



    // Function to create the FAS inout based on 
    // the input properties from user
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
            console. log(json);
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
        .catch(error => console. log(error));
    }


    // // 

    // process = (dataString) => {
    //     var lines = dataString
    //     .split (/\n/)
    //     .map(function(lineStr) {
    //         return lineStr.split(",");
    //     })
    //     .slice(1);

    //     return JSON.stringify(lines,null,2);
    // }
  
    // function to handle update of values in form 
    handleChange = (event) => {
        const inputName  = event.target.name;
        const inputValue = event.target.value;

        // run the validation here 
        this.setState({[inputName]:inputValue});

        if(inputName=="Target_Depth"){
            this.update_Target_Depth_Plots();
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


   // function to handle upload of FAS file
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

            console.log(worksheetName)

            const worksheet     = workbook.Sheets[worksheetName];

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

            console.log(inputName)

            if(inputName=="ReferenceDataFile"){
                this.setState({Reference_Site_Soil_Profile:Site_Soil_Profile_Data_Array});
                this.update_Reference_Site_Profile_Plots();
            }
            if(inputName=="TargetDataFile"){
                this.setState({Target_Site_Soil_Profile:Site_Soil_Profile_Data_Array});
                this.update_Target_Site_Profile_Plots();
            }
            this.update_Target_Depth_Plots();

        }.bind(this);

        // get the excel file
        var file = event.target.files[0]; 
        reader.readAsBinaryString(file);
    }


    //////////////////////////////////////////////////////////////////
    // Update Target Depth Plot
    //////////////////////////////////////////////////////////////////
    update_Target_Depth_Plots(){

        const Target_Depth = this.state.Target_Depth;
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

        console.log("i am he")

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

        console.log("i am he")

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

        // // to update new data to fix bedrock
        // var Fix_BedRock = newData;
        // Fix_BedRock.slice(-1)[0].Thickness=0;
        // this.setState({Reference_Site_Soil_Profile:Fix_BedRock});

        // update the state to new Reference Site Profile 
        this.setState({Reference_Site_Soil_Profile:newData});
        this.update_Reference_Site_Profile_Plots();
        this.update_Target_Depth_Plots();

    }

    //////////////////////////////////////////////////////////////////
    // Update the properties of Target Site Profile
    //////////////////////////////////////////////////////////////////
    update_Target_Site_Soil_Profile = (newData) => {

        // update the state to new Target Site Profile 
        this.setState({Target_Site_Soil_Profile:newData});
        this.update_Target_Site_Profile_Plots();
        this.update_Target_Depth_Plots();
    }

    render(){
        const { step, Tol, MaxIter,  EffStrain, MaxFreq, WavFrac, PGA, PGV, Magnitude, Distance, Region, FASFile, FAS, Target_Depth, whether_analyzed, Reference_Site_Soil_Profile, Site_Vs_Profile, Site_Damping_Profile, Target_Site_Soil_Profile, AccelTransferFunctionOutput,ResultsFile} = this.state;
        const inputValues = { Tol, MaxIter, EffStrain, MaxFreq, WavFrac, PGA, PGV, Magnitude, Distance, Region, FASFile, FAS, Target_Depth, whether_analyzed, Reference_Site_Soil_Profile, Site_Vs_Profile, Site_Damping_Profile, Target_Site_Soil_Profile, AccelTransferFunctionOutput,ResultsFile};
               
        switch(step) {
        case 1:
            return <Tab_1
                    nextStep              = {this.nextStep}
                    updateSoilLayers      = {this.update_Reference_Site_Soil_Profile}
                    readSoilProfileData   = {this.readExcelProfileData}
                    inputValues={inputValues}
                    />
        case 2:
            return <Tab_2
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    updateSoilLayers = {this.update_Target_Site_Soil_Profile}
                    readSoilProfileData   = {this.readExcelProfileData}
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
                />
        }
    }
}

export default Application;