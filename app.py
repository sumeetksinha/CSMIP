from flask import Flask, jsonify, request
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
import subprocess
import os
import json
import numpy as np
from operator import itemgetter
import copy 
import time 
import pystrata
# from   lib import processNGAfile
from scipy.fft import fft, fftfreq, rfft, rfftfreq, ifft, irfft
# import matplotlib.pyplot as plt

app = Flask(__name__, static_folder='app/build', static_url_path="")
# app = Flask(__name__)
CORS(app)

# @app.route('/time')
# def get_current_time():
#     print("Sumeet")
#     # return <h1> hello<h1>
#     return {'time': time.time()}
    
# # should get the user from a db or something else
# users_passwords = {'admin': 'admin', 'user': 'user'}
# users_claims = {
#     'admin': {
#         'username': 'admin',
#         'email': 'admin@admin.org',
#         'role': 'admin'
#     },
#     'user': {
#         'username': 'user',
#         'email': 'user@user.org',
#         'role': 'user'
#     }
# }


# @jwt.user_claims_loader
# def add_claims_to_access_token(identity):
#     return users_claims[identity]
# def getJason

def CreateInputFileForAnalysis(SampleJasonFile,InputParameters):

    SoilModels={ 1: 'EPRI (93), PI=10', 2: 'Seed & Idriss, Sand Mean' }

    # Opening JSON file
    with open(SampleJasonFile) as json_file:
        data = json.load(json_file)

    # write the calculator parameters
    data["calculator"]["errorTolerance"]=InputParameters["Tol"]
    data["calculator"]["maxIterations"]=InputParameters["MaxIter"]
    data["calculator"]["strainRatio"]=InputParameters["EffStrain"]

    # write the site profile parameters
    data["siteProfile"]["waveFraction"]=InputParameters["WavFrac"]
    data["siteProfile"]["maxFreq"]=InputParameters["MaxFreq"]

    # write the output depth 
    data["outputCatalog"]["ratiosOutputCatalog"][0]["outDepth"]=InputParameters["Depth_of_Interest"]

    # write the FAS input file 
    FASData = InputParameters["FAS"][0]["data"]
    data["motionLibrary"]["motions"][0]["fourierAcc"]=[ item["y"] for item in FASData ]
    data["motionLibrary"]["motions"][0]["freq"]=[ item["x"] for item in FASData ]

    # write soil layers and soil type catalog
    soilLayers = []
    soilTypecatalog = []

    sampleSoilLayer = {"avg": 150,"depth": 0,"hasMax": False, "hasMin": False,"isVaried": True,"max": 0,"min": 0,"soilType": 0,"stdev": 0,"thickness": 10,"type": 2}
    sampleSoilTypecatalog = { "damping": 5, "dampingModel": {"average": [0.57,0.86], "name": "Seed & Idriss, Sand Mean","strain": [0.0001,0.000316],"type": 1}, "dampingType": "NonlinearProperty", "freq": 1, "isVaried": True, "meanStress": 2, "minDamping": 0.5,"modulusModel": {"average": [1,0.99], "name": "Seed & Idriss, Sand Mean", "strain": [0.0001,0.000316], "type": 0},"modulusType": "NonlinearProperty", "nCycles": 10, "name": "Soil type 1", "notes": "", "ocr": 1, "pi": 0, "saveData": False, "untWt": 18 }
    depth = 0

    # print(InputParameters)

    # print(InputParameters["SoilLayers1"])
    for i in range(len(InputParameters["SoilLayers1"])-1):

        Layer = (sampleSoilLayer)
        Typecatalog = (sampleSoilTypecatalog)

        Thickness = InputParameters["SoilLayers1"][i]["Thickness"]
        Vs = InputParameters["SoilLayers1"][i]["Vs"]
        Gamma = InputParameters["SoilLayers1"][i]["Gamma"]
        Damping = InputParameters["SoilLayers1"][i]["Damping"]
        Soil_Model = int(InputParameters["SoilLayers1"][i]["Soil_Model"])

        # print("Soil_Model ", Soil_Model , " ", SoilModels[Soil_Model] )
    
        Layer["avg"] = Vs
        Layer["depth"] = depth
        Layer["soilType"] = i
        Layer["thickness"] = Thickness

        damp_strain, damp_avg = np.loadtxt("./Soil_Damping_Models/"+SoilModels[Soil_Model]+".txt", delimiter=',', unpack=True)
        Typecatalog["damping"] = Damping
        Typecatalog["dampingModel"]["average"] = list(damp_avg)
        Typecatalog["dampingModel"]["strain"] = list(damp_strain)
        Typecatalog["dampingModel"]["name"] = SoilModels[Soil_Model]

        modulus_strain, modulus_avg = np.loadtxt("./Soil_Modulus_Models/"+SoilModels[Soil_Model]+".txt", delimiter=',', unpack=True)
        Typecatalog["modulusModel"]["average"] = list(modulus_avg)
        Typecatalog["modulusModel"]["strain"] = list(modulus_strain)
        Typecatalog["modulusModel"]["name"] = SoilModels[Soil_Model]
        Typecatalog["untWt"] = Gamma

        Typecatalog["name"] = "Soil Type "+ str(i+1)

        soilLayers.append(copy.deepcopy(Layer))
        soilTypecatalog.append(copy.deepcopy(Typecatalog))

        depth = depth+Thickness

    # print(soilTypecatalog)
    data["siteProfile"]["soilLayers"]=soilLayers
    data["siteProfile"]["soilTypeCatalog"]=soilTypecatalog
    
    # ----- write bedrock soil properties 
    data["siteProfile"]["bedrock"]["avg"]=InputParameters["SoilLayers1"][-1]['Vs']
    data["siteProfile"]["bedrock"]["depth"]=depth
    data["siteProfile"]["bedrock"]["untWt"]=InputParameters["SoilLayers1"][-1]['Gamma']
    data["siteProfile"]["bedrock"]["avgDamping"]=InputParameters["SoilLayers1"][-1]['Damping']

    # write to the json file 
    jsonString = json.dumps(data)
    UniqFileName = str(time.time())+'.json'
    jsonFile = open(UniqFileName, "w")
    jsonFile.write(jsonString)
    jsonFile.close()

    return UniqFileName

###########################################################
# Generate FAS from Source_RVT_Theory_Motion
###########################################################
@app.route('/Generate_FAS', methods=['POST'])
def Generate_FAS():

    Magnitude= float(request.json["Magnitude"]);
    Distance = float(request.json["Distance"]);
    Region  = request.json["Region"];
    FAS     = request.json["FAS"];
    Npoints = 2**14 

    freqs = np.linspace(0, 1/(2*0.005), int(Npoints/2)+1)[:-1];
    freqs[0] = .01

    m = pystrata.motion.SourceTheoryRvtMotion(magnitude=Magnitude, distance=Distance, region=Region)
    m.calc_fourier_amps(freqs=freqs)

    FAS_Data_Array  = [];
    Freq = m.freqs;
    Amp  = m.fourier_amps;

    for i in range(len(Freq)):
        FAS_Data_Points = {};
        FAS_Data_Points["x"] = Freq[i];
        FAS_Data_Points["y"] = Amp[i];
        FAS_Data_Array.append(FAS_Data_Points);

    FAS[0]["data"]=FAS_Data_Array;
    return jsonify({'whether_analyzed': 2, 'FAS': FAS }), 200


###########################################################
# Analyze the problem
###########################################################
@app.route('/Analyze', methods=['POST'])
def Analyze():

    Target_Depth                = request.json["Target_Depth"];
    Reference_Site_Soil_Profile = request.json["Reference_Site_Soil_Profile"];
    Target_Site_Soil_Profile    = request.json["Target_Site_Soil_Profile"];
    FAS_Data                    = request.json["FAS"][0]["data"];
    Transfer_Functions          = request.json["Transfer_Functions"];

    Mod_Target_Site_Soil_Profile    = [];
    Mod_Reference_Site_Soil_Profile = (Reference_Site_Soil_Profile).copy();

    Bedrock_Layer_Index   = -1;
    Reference_Layer_Index = 0;
    Target_Layer_Index    = 0;

    depth = 0; prev_depth=0; layer_num=1;
    for i in range(0,len(Target_Site_Soil_Profile)):
        prev_depth = depth
        depth = depth+Target_Site_Soil_Profile[i]["Thickness"];
        if(prev_depth<Target_Depth and depth>Target_Depth):
            new_layer              = (Target_Site_Soil_Profile[i]).copy();
            new_layer["Thickness"] = (Target_Depth-prev_depth);
            Mod_Target_Site_Soil_Profile.append(new_layer);

            another_layer              = (Target_Site_Soil_Profile[i]).copy();
            another_layer["Thickness"] = (depth-Target_Depth);            
            Mod_Target_Site_Soil_Profile.append(another_layer);
        else:
            Mod_Target_Site_Soil_Profile.append(Target_Site_Soil_Profile[i]);

    # make the bedrock layer of the soil profile to have zero thickness
    Reference_Bedrock = Reference_Site_Soil_Profile[-1].copy();
    Reference_Bedrock["Thickness"] = 0;
    Mod_Reference_Site_Soil_Profile.append(Reference_Bedrock);

    Target_Bedrock = Target_Site_Soil_Profile[-1].copy();
    Target_Bedrock["Thickness"] = 0;
    Mod_Target_Site_Soil_Profile.append(Target_Bedrock);

    # Initialize the Reference Profile
    Pystrata_Reference_Soil_Profile_Layers = [];
    for i in range(len(Mod_Reference_Site_Soil_Profile)):
        Name      =Mod_Reference_Site_Soil_Profile[i]["Name"];
        Thickness =Mod_Reference_Site_Soil_Profile[i]["Thickness"];
        Vs        =Mod_Reference_Site_Soil_Profile[i]["Vs"];
        Gamma     =Mod_Reference_Site_Soil_Profile[i]["Gamma"];
        Damping   =Mod_Reference_Site_Soil_Profile[i]["Damping"];
        Soil_Model=Mod_Reference_Site_Soil_Profile[i]["Soil_Model"];
        Pystrata_Reference_Soil_Profile_Layers.append(pystrata.site.Layer(soil_type=pystrata.site.SoilType(name=Name,unit_wt=Gamma, mod_reduc=None, damping=Damping), thickness=Thickness, shear_vel=Vs),)
    Pystrata_Reference_Soil_Profile = pystrata.site.Profile(layers= Pystrata_Reference_Soil_Profile_Layers)

    # Initialize the Target Profile
    Target_Layer_Index = 0; depth =0;
    Pystrata_Target_Soil_Profile_Layers = [];
    for i in range(len(Mod_Target_Site_Soil_Profile)):
        Name      =Mod_Target_Site_Soil_Profile[i]["Name"];
        Thickness =Mod_Target_Site_Soil_Profile[i]["Thickness"];
        Vs        =Mod_Target_Site_Soil_Profile[i]["Vs"];
        Gamma     =Mod_Target_Site_Soil_Profile[i]["Gamma"];
        Damping   =Mod_Target_Site_Soil_Profile[i]["Damping"];
        Soil_Model=Mod_Target_Site_Soil_Profile[i]["Soil_Model"];
        depth     = depth + Thickness;
        if(depth==Target_Depth):
            Target_Layer_Index=i+1;
        Pystrata_Target_Soil_Profile_Layers.append(pystrata.site.Layer(soil_type=pystrata.site.SoilType(name=Name,unit_wt=Gamma, mod_reduc=None, damping=Damping), thickness=Thickness, shear_vel=Vs),)
    Pystrata_Target_Soil_Profile = pystrata.site.Profile(layers= Pystrata_Target_Soil_Profile_Layers)

    ###########################################################################
    # SRA
    ###########################################################################
    n = len(FAS_Data); Freq=np.zeros(n); FAS_A =np.zeros(n); 
    for i in range(n):
        Freq[i] = FAS_Data[i]["x"];
        FAS_A[i]  = FAS_Data[i]["y"];

    m = pystrata.motion.RvtMotion(Freq,FAS_A);

    ###########################################################################
    # Key locations
    ###########################################################################
    Bedrock_Layer_Index;   # Input motion, both sites (point A)
    Reference_Layer_Index; # Top of surface, reference site (point B)
    Target_Layer_Index;    # Target depth (point C)

    ###########################################################################
    # Calculators
    ###########################################################################
    calc_reference = pystrata.propagation.LinearElasticCalculator()
    calc_target    = pystrata.propagation.LinearElasticCalculator()

    # Outputs
    ###########################################################################
    outputs_reference = pystrata.output.OutputCollection([
        pystrata.output.FourierAmplitudeSpectrumOutput(
        Freq,
        pystrata.output.OutputLocation('outcrop', index = Reference_Layer_Index),
        ),
        ])

    outputs_target = pystrata.output.OutputCollection([
        pystrata.output.FourierAmplitudeSpectrumOutput(
        Freq,
        pystrata.output.OutputLocation('outcrop', index = Target_Layer_Index),
        ),
        ])

    # SRA
    ###########################################################################
    calc_reference(m,Pystrata_Reference_Soil_Profile,Pystrata_Reference_Soil_Profile.location('outcrop', index=Bedrock_Layer_Index))
    outputs_reference(calc_reference)

    calc_target(m,Pystrata_Target_Soil_Profile,Pystrata_Target_Soil_Profile.location('outcrop', index=Bedrock_Layer_Index))
    outputs_target(calc_target)

    # Double convolution transfer function
    ###########################################################################
    FAS_B = outputs_reference[0].values
    FAS_C = outputs_target[0].values

    TF1 = FAS_A/FAS_B
    TF2 = FAS_C/FAS_A
    TF  = TF1*TF2

    # Sending data to the app
    ###########################################################################
    Reference_Site_TF_Data_Array           = [];
    Target_Site_TF_Data_Array              = [];
    Reference_to_Target_Site_TF_Data_Array = [];

    for i in range(len(Freq)):

        Reference_Site_TF_Data_Points = {};
        Reference_Site_TF_Data_Points["x"] = Freq[i];
        Reference_Site_TF_Data_Points["y"] = TF1[i];
        Reference_Site_TF_Data_Array.append(Reference_Site_TF_Data_Points);


        Target_Site_TF_Data_Points = {};
        Target_Site_TF_Data_Points["x"] = Freq[i];
        Target_Site_TF_Data_Points["y"] = TF2[i];
        Target_Site_TF_Data_Array.append(Target_Site_TF_Data_Points);


        Reference_to_Target_Site_TF_Data_Points = {};
        Reference_to_Target_Site_TF_Data_Points["x"] = Freq[i];
        Reference_to_Target_Site_TF_Data_Points["y"] = TF[i];
        Reference_to_Target_Site_TF_Data_Array.append(Reference_to_Target_Site_TF_Data_Points);

    Transfer_Functions[0]["data"] =Reference_Site_TF_Data_Array;
    Transfer_Functions[1]["data"] =Target_Site_TF_Data_Array;
    Transfer_Functions[2]["data"] =Reference_to_Target_Site_TF_Data_Array;

    return jsonify({'whether_analyzed': 2, 'Transfer_Functions': Transfer_Functions }), 200

###########################################################
# Analyze the problem
###########################################################
@app.route('/Generate_Motion', methods=['POST'])
def Generate_Motion():

    print("I am ahere")

    # Transfer Function form the analysis
    ###########################################################################
    TF_Data = request.json["Transfer_Functions"][2]["data"];
    TF   = np.zeros(len(TF_Data))
    Freq = np.zeros(len(TF_Data))

    for i in range(len(TF_Data)):
        TF[i] = TF_Data[i]["y"];
        Freq[i] = TF_Data[i]["x"];

    # Input Motion form the user
    ###########################################################################
    Motion             = request.json["Motion"];
    Ground_Motion_Data = request.json["Motion"][0]["data"];

    N = len(Ground_Motion_Data)
    Ground_Motion_Time = np.zeros(N);
    Ground_Motion_Acc  = np.zeros(N);

    for i in range(N):
        Ground_Motion_Time[i] = Ground_Motion_Data[i]["x"];
        Ground_Motion_Acc[i]  = Ground_Motion_Data[i]["y"];

    dt = Ground_Motion_Time[1]-Ground_Motion_Time[0];

    # Apply Tranfer Function to the Ground Motion
    ###########################################################################
    xf = rfftfreq(N,dt)
    ground_motion_yf  = rfft(Ground_Motion_Acc);
    input_motion_yf   = copy.deepcopy(ground_motion_yf)*np.interp(xf,Freq,TF);
    Input_Motion_Acc  = irfft(input_motion_yf)

    # Sending data to the app
    ###########################################################################
    Input_Motion_Data  = copy.deepcopy(Ground_Motion_Data);
    for i in range(N):
        Input_Motion_Data[i]["y"] = copy.deepcopy(Input_Motion_Acc[i])

    Motion[0]["data"] = copy.deepcopy(Ground_Motion_Data);
    Motion[1]["data"] = copy.deepcopy(Input_Motion_Data);

    # print(Motion[0]["data"][:10])
    # print(Motion[1]["data"][:10])

    # plt.figure()
    # plt.plot(Ground_Motion_Time,Ground_Motion_Acc)
    # plt.plot(Ground_Motion_Time,Input_Motion_Acc)
    # plt.savefig("Plot.png")


    return jsonify({'whether_processed': 2, 'Motion': Motion }), 200

###########################################################
# Show the build webpage
###########################################################
@app.route('/api',methods=["GET"])
@cross_origin()
def index():
    return {
    "tuorial":"Flask React Heroku"
    }

###########################################################
# Index html serve
###########################################################
@app.route('/')
def serve():
    return send_from_directory(app.static_folder,"index.html")

if __name__ == '__main__':
    # app.jinja_env.auto_reload = True
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run()
