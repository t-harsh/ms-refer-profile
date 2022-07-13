import React, { useRef, useEffect, useState } from "react";
import { locations } from "./Data/locations";
import { profiles } from "./Data/profiles";
import { Button, Text, Form, Input, FormField, FormLabel, FormMessage, FormTextArea, FormInput, FormRadioGroup, Divider, Alert } from '@fluentui/react-northstar';
import useInputState from "../../hooks/useInputState";
import { loginRequest } from "./../../authConfig";
import { useMsal } from "@azure/msal-react";
import "./Deploy.css";
import { BookmarkIcon } from '@fluentui/react-icons-northstar';
import Banner from 'react-js-banner';



export const Forms = (props) => {

    const profileForm = useRef(null);
    const FirstName = useInputState();
    const LastName = useInputState();
    const InputEmail = useInputState();
    const MobileNo = useInputState();
    const Location = useInputState();
    const About = useInputState();
    const Job = useInputState();
    const Code = useInputState();
    const { instance, accounts } = useMsal();
    const [token, setToken] = useState();
    const [saveProfile, setSaveProfile] = useState(false);
    const [selectedJob, setSelectedJob] = useState(false);


    let locationCountryCodes = locations();
    let Locations = locationCountryCodes.map((location) =>
        <option value={location.key}>{location.text}</option>
    );


    let profilesData = profiles();
    let Profiles = profilesData.map((profile) =>
        <option value={profile.key}>{profile.text}</option>
    );

    const EndorseItems = [
        {
            name: 'true',
            key: 'true',
            label: 'Yes',
            value: 'true',
        },
        {
            name: 'false',
            key: 'false',
            label: `I don't know enough`,
            value: 'false',
        }
    ]

    const UnivItems = [
        {
            name: 'true',
            key: 'true',
            label: 'Yes',
            value: 'true',
        },
        {
            name: 'false',
            key: 'false',
            label: `No`,
            value: 'false',
        }
    ]

    const fillData = () => {
        FirstName.handleSet(props.item.firstName);
        LastName.handleSet(props.item.lastName);
        InputEmail.handleSet(props.item.emailId);
        MobileNo.handleSet(props.item.mobileNo);
        Location.handleSet(props.item.location);
        About.handleSet(props.item.about);
        Code.handleSet(props.item.code);

        console.log("Auto Fill Competed");
    }

    useEffect(() => {
        fillData();
    }, [])

    const searchJob = () => {
        const form = profileForm.current;
        const jobId = form['Job'].value;
        console.log(jobId);

        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            setToken(response.idToken);
        });

        var bearer = 'Bearer ' + token;
        var url = 'https://hrgtareferservicedev.azurewebsites.net/v2/job/' + jobId;

        fetch(url, {
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json',
                'Authorization': bearer
            },
            method: 'GET',
            mode: 'cors'
        }).then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setSelectedJob(true);
                document.getElementById("jobValidation").style.color = "green";
                document.getElementById("jobValidation").innerHTML = result.jobId + " - " + result.jobRoleName;
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById("jobValidation").style.color = "red";
                document.getElementById("jobValidation").innerHTML = "No such Job Id exists";
            });

    }

    const sendForm = async (e) => {
        e.preventDefault();
        const { FirstName, LastName, InputEmail, MobileNo, Location, Relation, About, Code } = e.target

        console.log(FirstName.value);
        console.log(LastName.value);

        const profileId = (props.item?.profileId)?.toString();

        var url = 'https://localhost:7119/profiles/update/'

        url = url + profileId;

        await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                firstName: FirstName.value,
                lastName: LastName.value,
                emailId: InputEmail.value,
                mobileNo: MobileNo.value,
                location: Location.value,
                relation: Relation.value,
                about: About.value,
                code: Code.value
            })
        })
        setSaveProfile(true);
    }



    return (
        <Form ref={profileForm} onSubmit={(e) => { sendForm(e) }}>
            <br />
            <FormInput label="First Name" {...FirstName.values} type="text" name="FirstName" id="FirstName" aria-describedby="First Name" placeholder="Enter First Name" required inline />

            <FormInput label="Last Name" {...LastName.values} type="text" name="LastName" id="LastName" aria-describedby="Last Name" placeholder="Enter Last Name" required inline />

            <FormInput label="Your Email" {...InputEmail.values} name="InputEmail" id="InputEmail" type="email" aria-describedby="emailHelp" placeholder="Enter email" inline required />

            <FormInput label="Mobile No." {...MobileNo.values} name="MobileNo" id="MobileNo" type="text" aria-describedby="Mobile Number" placeholder="Enter Phone Number" inline required />

            <label htmlFor="Location">Location*</label>
            <select {...Location.values} name="Location" id="Location" aria-describedby="Location" placeholder="Enter Location" style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                {Locations}
            </select><br />

            <FormRadioGroup name="isEndorsed" id="isEndorsed" label="Do you endorse this person professionally and recommend them as a hire?*" vertical required defaultCheckedValue="true" items={EndorseItems} style={{ fontFamily: "Segoe UI", color: "#484644" }} />


            <FormInput label="Search for Job IDs" name="Job" type="text" id="Job" aria-describedby="Search for Job IDs" placeholder="Enter ID" style={{ margin: "5px 0 5px 0" }} onChange={searchJob} fluid />
            <p id="jobValidation" style={{ color: "green", fontStyle: "italic" }}></p>

            <label htmlFor="Position">Which job profile are you referring the candidate for?*</label>
            <select name="Position" id="Position" aria-describedby="Job Profile" placeholder="Enter Job Profile" required style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                {Profiles}
            </select><br />

            <label htmlFor="Relation">How do you know this person?*</label>
            <select name="Relation" id="Relation" aria-describedby="Relation" placeholder="Mention how you know this person" style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                <option value={1}>I don't know this person directly</option>
                <option value={2}>I know this person, but haven't worked with them</option>
                <option value={3}>I went to college/university with this person</option>
                <option value={4}>I have worked with this person before</option>
            </select><br />

            <FormRadioGroup name="isUniversity" id="isUniversity" label="Is your referral a current university student or recent graduate (within last 12 months)?*" vertical required defaultCheckedValue="true" items={UnivItems} style={{ fontFamily: "Segoe UI", color: "#484644" }} />

            <FormTextArea
                placeholder="Max 2000 characters..."
                {...About.values} name="About" id="About"
                maxLength={2000}
                label="Please provide additional information regarding the candidate’s skills etc."
                fluid
            />

            <FormInput {...Code} label="Referral Campaign Code" type="text" name="Code" id="Code" aria-describedby="Referral campaign code" placeholder="Enter Code here" inline /><br />
            <div style={{ display: "inline-block" }}>
                <Button primary style={{ width: "9rem", float: "right", margin: "0px 5px" }}>Submit Referral</Button>
                <Button type="submit" secondary style={{ width: "9rem", float: "right", margin: "0px 5px" }}>Save Profile</Button>
            </div>
            <div>
                {/* {saveProfile */}
                {true
                    ? <Banner
                        title="Profile Saved"
                        css={{
                            backgroundColor: "rgba(173, 210, 173, 0.7)",
                            height: "30px",
                            width: "10rem",
                            position: "absolute",
                            right:"2rem",
                            color: "green"
                        }}
                        visibleTime={1500}
                    />
                    : <></>
                }
            </div>
        </Form>
    )
}