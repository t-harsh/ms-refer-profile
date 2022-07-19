import React from "react";
import { AffindaCredential, AffindaAPI } from "@affinda/affinda";
import fs from "fs";
    
    export function ResumeParse(inputFile) {
    const credential = new AffindaCredential("11c48462d4df64e057ef2ce45fc5e07dcb3977b2")
    const client = new AffindaAPI(credential)

        // const readStream = fs.createReadStream("");
        
    //     return client.createResume({file: inputFile}).then((result) => {
    //         console.log("Returned data:");
    //         console.dir(result)
    //         return result;
    //     })
    // }

    return client.createResume({ url: "https://api.affinda.com/static/sample_resumes/example.pdf" }).then((result) => {
        console.log("Returned data:");
        console.dir(result);
        return result;
    })
}

// import { AffindaCredential, AffindaAPI } from "@affinda/affinda";
 
// export default function App() {
//   const token = "REPALCE_TOKEN";
//   const credential = new AffindaCredential(token);
//   const client = new AffindaAPI(credential);
 
//   parseURL = async (e) => {
//     client.createResume({
//         url: "https://api.affinda.com/static/sample_resumes/example.pdf"
//       }).then((result) => {
//         console.log("Returned data:");
//         console.dir(result);
//       }).catch((err) => {
//         console.log("An error occurred:");
//         console.error(err);
//       });
//   };
 
//   parseFile = async (e) => {
//     e.preventDefault();
//     client.createResume({ file: e.target.files[0] }).then((result) => {
//         console.log("Returned data:");
//         console.dir(result);
//       }).catch((err) => {
//         console.log("An error occurred:");
//         console.error(err);
//       });
//   };
 
//   return (
//     <div className="App">
//       <h1>Hello World</h1>
//       <button onClick={(e) => this.parseURL(e)}>Parse URL</button>
//       <br />
//       <input type="file" onChange={(e) => this.parseFile(e)} />
//     </div>
//   );
// }