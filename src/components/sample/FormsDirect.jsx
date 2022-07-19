import React, { useRef, useEffect, useState } from "react";
import { profiles } from "./Data/profiles";
import { Button, Text, Form, Input, FormField, FormLabel, FormMessage, FormTextArea, FormInput, FormRadioGroup, Divider, Alert } from '@fluentui/react-northstar';
import Banner from 'react-js-banner';
import { loginRequest } from "./../../authConfig";
import { useMsal } from "@azure/msal-react";


export const FormsDirect = (props) => {

    // Hooks Initialization

    const profileForm = useRef(null);
    const [saveProfile, setSaveProfile] = useState(false);
    const [referCall, setReferCall] = useState(false);
    const [selectedJob, setSelectedJob] = useState(false);

    const { instance, accounts } = useMsal();
    const [token, setToken] = useState();

    // Dropdown options

    let profilesData = profiles();
    let Profiles = profilesData.map((profile) =>
        <option value={profile.key}>{profile.text}</option>
    );

    // Job Validation

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

    // Create Referral

    const handleClickEvent = () => {
        const form = profileForm.current;
        const ResumeUri = generateGuid();
        const formData = new FormData();

        formData.append('firstName', props.item.firstName);
        formData.append('lastName', props.item.lastName);
        formData.append('candidateEmail', props.item.emaidId);
        formData.append('candidatePhone', props.item.mobileNo);
        formData.append('location', parseInt(props.item.location));
        formData.append('profile', form['Position'].value);
        formData.append('jobIds', form['Job'].value);
        formData.append('acquaintanceLevel', props.item.relation);
        formData.append('additionalInformation', props.item.about);
        formData.append('campaignCode', props.item.code);
        formData.append('isUniversityStudent', (props.item.isUniversity ? true : false));
        formData.append('isEndorsed', (props.item.isEndorsed ? 1 : 0));
        formData.append('resumeUri', ResumeUri);


        var bearer = 'Bearer ' + token;
        console.log("Testing bearer = " + bearer);

        fetch('https://hrgtareferservicedev.azurewebsites.net/v2/refer', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Authorization': bearer
            },
            mode: 'cors',
            body: formData,
        }).then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setReferCall(true);
    }

    //Generate guid id for Resume

  function generateGuid() {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }


    return (
        <div>
            <Form ref={profileForm}>
                <div></div>
                <FormInput label="Search for Job IDs" name="Job" type="text" id="Job" aria-describedby="Search for Job IDs" placeholder="Enter ID" style={{ margin: "5px 0 5px 0" }} onChange={searchJob} fluid required />
                <p id="jobValidation" style={{ color: "green", fontStyle: "italic" }}></p>

                <label htmlFor="Position">Which job profile are you referring the candidate for?*</label>
                <select name="Position" id="Position" aria-describedby="Job Profile" placeholder="Enter Job Profile" required style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                    {Profiles}
                </select><br /><br />

                <Button primary onClick={handleClickEvent} style={{ position: "absolute", right: "150px", bottom: "12px" }}>Refer</Button>
                <div>
                {referCall
                ? <Banner
                  title="Referred Successfully"
                  css={{
                    backgroundColor: "rgba(173, 210, 173, 0.7)",
                    height: "30px",
                    width: "12rem",
                    position: "absolute",
                    bottom:"1.5rem",
                    left: "9rem",
                    color: "rgb(58, 109, 78)",
                    fontWeight: "550"
                  }}
                  visibleTime={1500}
                />
                : <></>
              }
              </div>

            </Form>
        </div>
    )

}

