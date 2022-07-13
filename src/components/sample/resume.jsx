import React from "react";
import { AffindaCredential, AffindaAPI } from "@affinda/affinda";
import fs from "fs";


// export function ResumeParse(inputFile : File | undefined) {
    
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