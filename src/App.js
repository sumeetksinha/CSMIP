import React, { useState, useEffect } from 'react';
import Application from "./components/0_Application";
import './App.css';
import Illustration from './Profile_Pic.png';
import { usePython } from "react-py";
// import { PythonProvider } from "react-py";

// function Codeblock() {
//   const [input, setInput] = useState("");

//   // Use the usePython hook to run code and access both stdout and stderr
//   const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

//   return (
//     <>
//       {isLoading ? <p>Loading...</p> : <p>Ready!</p>}
//       <form>
//         <textarea
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter your code here"
//         />
//         <input
//           type="submit"
//           value={!isRunning ? "Run" : "Running..."}
//           disabled={isLoading || isRunning}
//           onClick={(e) => {
//             e.preventDefault();
//             runPython(input);
//           }}
//         />
//       </form>
//       <p>Output</p>
//       <pre>
//         <code>{stdout}</code>
//       </pre>
//       <p>Error</p>
//       <pre>
//         <code>{stderr}</code>
//       </pre>
//     </>
//   );
// }

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  // useEffect(() => {
  //   fetch('/time').then(res => res.json()).then(data => {
  //     setCurrentTime(data.time);
  //   });
  // }, []);

  useEffect(() => {
    fetch('/api').then(response => {
      if(response.status==200){
        return response.json()
      }
    }).then(data=>console.log(data))
    .then(error=> console.log(error))
  },[])

  return (
      <div className="container"> 

        <h2> Generate Ground Motions for Nonlinear Deformation Analyses </h2>
        A web application for the development of input ground motions for nonlinear deformation analyses following the double convolution approach. The application is expected to facilitate and increase the use of ground motion seismic recordings by practitioners.        <hr/>

        <Application />

        <br></br>
        <br></br>

        <img src={Illustration} alt="Illustration" width='100%'></img>

        <br></br>
        <br></br>

        <hr/>

        <h5> Refernces</h5>
        <ul>
        <li>Pretell R., Sinha S.K., Ziotopoulou K., and Watson-Lamprey J.A. (2021). <i> Broadening the utilization of CSMIP data: Double convolution methodology towards developing input motions for site response and nonlinear deformation analyses.</i> In SMIP Seminar on Utilization of Strong Motion Data, California Geological Survey.</li>
        <li>Pretell R., Ziotopoulou K., and Abrahamson N. (2019). <i> Methodology for the development of input motions for nonlinear deformation analyses</i>. 7th International Conference on Earthquake Geotechnical Engineering, Rome, Italy.</li>
        </ul>

        <h5> Acknowledgements</h5>
        <p>The project was funded by California Strong Motion Instrumentation Program under the agreemnet number xxxxx.</p>

    </div>
  );
}



// return (
//   <div className="App">
//     <header className="App-header">
//   <img src={logo} className="App-logo" alt="logo" />
//       <p>
//         Edit <code>src/App.js</code> and save to reload.
//       </p>
//       <p>The current time is {currentTime}.</p>
//       <p>Tabs Demo</p>
//       <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
//         <Tab eventKey="home" title="Home">
//         </Tab>
//         <Tab eventKey="profile" title="Profile">
//         </Tab>
//         <Tab eventKey="contact" title="Contact" disabled>
//         </Tab>
//       </Tabs>
//       <Button variant="primary"> Bootstrap </Button>
//     </header>
//   </div>
// );
// }

export default App;