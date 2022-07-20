import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { ProfileData } from "./components/ProfileData";
import { callMsGraph } from "./graph";
import "./styles/App.css";
import { Design } from "./components/sample/Design"
import { Deploy } from "./components/sample/Deploy"
import { Route, Routes } from "react-router-dom"
import "./App.css";
import { Text, Button } from '@fluentui/react-northstar';

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
            console.log(response.idToken);
        });
    }

    return (
        <>
            {graphData ?
                <ProfileData graphData={graphData} />
                :
                <Button primary onClick={RequestProfileData}>Request Profile Information</Button>
            }
        </>
    );
};


const ProfileContent2 = () => {
    const { instance, accounts } = useMsal();
    return (
        <>
            <p className="card-title">&nbsp;Welcome <b style={{ color: "#444791", fontFamily: "Segoe UI" }}> {accounts[0].name} </b> to the MS Referral!</p>
        </>
    );
};


export const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please Log In!</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export const MainContent2 = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent2 />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Welcome to MS Refer. Please Log In!</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <>
            <PageLayout>
                <div style={{ marginTop: "70px" }}>

                </div>
                <MainContent2 />
            </PageLayout>

            <div style={{ marginTop: "100px" }}>

            </div>

            <div className="holder">
                
                <Routes>
                    <Route path="/" element={<Design />} />
                    <Route path="/Refer" element={<Design />} />
                    <Route path="/Saved-Profiles" element={<Deploy />} />
                </Routes>
            </div>
        </>
    );
}
