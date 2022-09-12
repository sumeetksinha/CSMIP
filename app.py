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


@app.route('/analyze', methods=['POST'])

def login():

    # print("Sumeet")
    # print(request.json) # get the request,json from frontend
    # print(os.getcwd()) # get current working dierctory

    # read the sample jason file and create a new input file
    UniqFileName = CreateInputFileForAnalysis("Sample_Input.json",request.json)   
    # UniqFileName = "Sample_Input.json"
    # command = "\"C:\Program Files (x86)\Strata 1.0.0\strata.exe\" -b " +  UniqFileName
    command = "\"/mnt/c/Program Files (x86)/Strata 1.0.0\" -b " +  UniqFileName

    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)
    process.wait()
    # print (process.returncode)

    # read the json output file 
    Fjson = open(UniqFileName,)
    # returns JSON object as a dictionary
    data = json.load(Fjson)
    # print(data)
    hasResults = data["hasResults"]

    if(hasResults):
        Output_maxFreq = data["outputCatalog"]["frequency"]['max']
        Output_minFreq = data["outputCatalog"]["frequency"]['min']
        Output_sizeFreq = data["outputCatalog"]["frequency"]['size']
        Output_Freq     = np.linspace(np.log10(Output_minFreq),np.log10(Output_maxFreq),Output_sizeFreq)
        Output_Freq     = np.power(10,Output_Freq)

        Output_maxPeriod = data["outputCatalog"]["period"]['max']
        Output_minPeriod = data["outputCatalog"]["period"]['min']
        Output_sizePeriod = data["outputCatalog"]["period"]['size']
        Output_Period     = np.linspace(np.log10(Output_minPeriod),np.log10(Output_maxPeriod),Output_sizePeriod)
        Output_Period     = np.power(10,Output_Period)

        # read AccelTransferFunctionOutput at the given depth 
        AccelTransferFunctionOutput = data["outputCatalog"]["ratiosOutputCatalog"][0]["data"][0][0]
        # print(AccelTransferFunctionOutput)
        AccelTransferFunctionOutput_List = []

        for i in range(len(AccelTransferFunctionOutput)):
            AccelTransferFunctionOutput_List.append({"x":Output_Freq[i],"y":AccelTransferFunctionOutput[i]})

        AccelTransferFunctionOutput = [{"id": "AccelTransferFunctionOutput",
                                        "data":AccelTransferFunctionOutput_List
                                    },]

    return jsonify({'whether_analyzed': 2, "AccelTransferFunctionOutput":AccelTransferFunctionOutput , "ResultsFile":data}), 200

    # login_json = request.get_json()

    # if not login_json:
    #     return jsonify({'msg': 'Missing JSON'}), 400

    # username = login_json.get('username')
    # password = login_json.get('password')

    # if not username:
    #     return jsonify({'msg': 'Username is missing'}), 400

    # if not password:
    #     return jsonify({'msg': 'Password is missing'}), 400

    # user_password = users_passwords.get(username)

    # if not user_password or password != user_password:
    #     return jsonify({'msg': 'Bad username or password'}), 401

    # access_token = create_access_token(identity=username)

    # return jsonify({'access_token': access_token}), 200


# @app.route('/api/protected', methods=['GET'])
# @jwt_required
# def protected():
#     claims = get_jwt_claims()
#     if claims.get('username') == 'admin':
#         return jsonify({'data': ['hi', 'it', 'works']}), 200
#     return jsonify({'msg': 'No access for you!'}), 400


# if __name__ == '__main__':
#     app.jinja_env.auto_reload = True
#     app.config['TEMPLATES_AUTO_RELOAD'] = True
#     app.run(debug=True, host='0.0.0.0')


@app.route('/api',methods=["GET"])
@cross_origin()
def index():
    return {
    "tuorial":"Flask React Heroku"
    }

@app.route('/')
def serve():
    return send_from_directory(app.static_folder,"index.html")

if __name__ == '__main__':
    # app.jinja_env.auto_reload = True
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run()
