import { Button, CardHeader, CardBody, Card, Flex, Text, Grid, Segment, Loader, Alert, Attachment } from "@fluentui/react-northstar";
import { Form, Input, FormField, FormLabel, FormMessage, FormTextArea, FormInput, FormDropdown, FormRadioGroup, Divider, Avatar } from '@fluentui/react-northstar';
import { ApprovalsAppbarIcon, BookmarkIcon, ContactCardIcon, CallControlPresentNewIcon, AcceptIcon, MeetingNewIcon, AttendeeIcon, FilesPdfIcon } from '@fluentui/react-icons-northstar'
import { ResumeParse } from "./resume";
import React, { useState, useRef } from "react";
import useInputState from "../../hooks/useInputState";
import { useMsal } from "@azure/msal-react";
import { callMsGraph } from "./../../graph";
import { loginRequest } from "./../../authConfig";
import { locations } from "./Data/locations";
import { profiles } from "./Data/profiles";
import { MainContent } from "./../../App";
import "./Design.css";
import Banner from 'react-js-banner';
import { useEffect } from "react";

export function Design() {

  const { instance, accounts } = useMsal();
  const [token, setToken] = useState();
  const profileForm = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(false);
  const [selectedAutofill, setAutofill] = useState(false);
  const [selectedAutofillComplete, setAutofillComplete] = useState(false);
  const [AlertResume, setAlertResume] = useState(false);
  const [saveProfile, setSaveProfile] = useState(false);
  const [referCall, setReferCall] = useState(false);

  const FirstName = useInputState();
  const LastName = useInputState();
  const InputEmail = useInputState();
  const MobileNo = useInputState();
  const Location = useInputState();
  const About = useInputState();
  const Job = useInputState();

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


  const changeHandler = async (event) => {

    setAlertResume(true);
    setAutofill(true);
    const target = event.target;
    setSelectedFile(target.files[0]);
    const result = await ResumeParse(selectedFile)
    console.log(result);

    if (result) {
      FirstName.handleSet(result.data?.name?.first);
      LastName.handleSet(result.data?.name?.last);
      InputEmail.handleSet(result.data?.emails?.[0]);
      MobileNo.handleSet(result.data?.phoneNumbers?.[0]);
      About.handleSet(result.data?.profession);
    }
    setAutofill(false);
    setAutofillComplete(true);
  };


  const sendForm = async (e) => {
    e.preventDefault();

    const { FirstName, LastName, InputEmail, MobileNo, Location, Relation, isEndorsed, isUniversity, About, Code } = e.target

    console.log(FirstName.value);
    console.log(LastName.value);
    console.log(About.value);


    let form = profileForm.current;
    console.log(`${form['FirstName'].value} ${form['LastName'].value}`)

    let formData = new FormData();
    if (selectedFile) {
      formData.append('firstName',FirstName.value );
      formData.append('lastName', LastName.value);
      formData.append('candidateEmail', InputEmail.value);
      formData.append('location', Location.value);
      formData.append('profile', Position.value);
      formData.append('acquaintanceLevel', Relation.value);
      formData.append('isEndorsed', true);
      formData.append('additionalInformation', About.value);
      formData.append('campaignCode', Code.value);
      formData.append('isUniversityStudent', true);
      formData.append('resumeFile', selectedFile);
      
    }
    
    console.log("Form-data : " , formData);

    await fetch('https://localhost:7119/upload', {
      method: 'POST',
      mode: 'cors',
      body: formData,
    }).then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
        setSaveProfile(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  //   await fetch('https://referralprofilesv2-api.azure-api.net/v1/profiles/create', {
  //     headers: {
  //       // 'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST',
  //     mode: 'cors',
  //     body: JSON.stringify({
        // firstName: FirstName.value,
        // lastName: LastName.value,
        // emailId: InputEmail.value,
        // mobileNo: MobileNo.value,
        // location: Location.value,
        // relation: Relation.value,
        // exampleRadios1: true,
        // exampleRadios2: true,
        // about: About.value,
        // code: Code.value
  //     })
  //   })
  //   setSaveProfile(true);
  // }

  const handleClickEvent = () => {
    let form = profileForm.current;
    console.log(`${form['FirstName'].value} ${form['LastName'].value}`)
    const formData = new FormData();
    if (selectedFile) {
      formData.append('firstName', (form['FirstName'].value).toString());
      formData.append('lastName', (form['LastName'].value).toString());
      formData.append('candidateEmail', (form['InputEmail'].value).toString());
      formData.append('location', form['Location'].value);
      formData.append('profile', (form['Position'].value).toString());
      formData.append('acquaintanceLevel', form['Relation'].value);
      formData.append('isEndorsed', form['isEndorsed'].value);
      formData.append('isUniversityStudent', form['isUniversity'].value);
      formData.append('additionalInformation', (form['About'].value).toString());
      formData.append('campaignCode', (form['Code'].value).toString());
      formData.append('isUniversityStudent', 'true');
      formData.append('resumeFile', selectedFile);
    }

    instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    }).then((response) => {
      // console.log("Token = " + token);
      setToken(response.idToken);
    });

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

  function scrollToSmoothly(pos, time) {
    var currentPos = window.pageYOffset;
    var start = null;
    if (time == null) time = 500;
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      var progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  }

  function jobScrollFocus() {
    scrollToSmoothly(document.getElementById("ProfessionalCard").offsetTop, 1500);
    document.getElementById("Job").focus();
  }

  {
    selectedAutofillComplete
      ? jobScrollFocus()
      : <></>
  }



  return (
    <div className="body">
      <div className="heading">
        OR
        <br />
      </div>

      <Grid columns="repeat(4, 1fr)" rows="280px 200px">
        <Segment
          content="Header"
          inverted
          styles={{
            gridColumn: 'span 2',
            backgroundColor: "rgba(155, 155, 155, 0)",
            boxShadow: 'none'
          }}
        >

          <Card aria-roledescription="card avatar"
            elevated
            inverted
            className="Cards"
            style={{ backgroundColor: "#fcfcfc", width: "70%", float: "right", marginRight: "40px" }}
            onClick={() => scrollToSmoothly(document.getElementById("create-refer").offsetTop, 500)}>

            <Flex gap="gap.small" column fill vAlign="stretch" space="around" >

              <div className="card-head">
                Create a New Referral
              </div>

              <CardBody>

                <div className="info-content">
                  <Divider />
                  <br />
                  <MeetingNewIcon />&nbsp;&nbsp; Referring your friends just 2 clicks away
                </div>

              </CardBody>

            </Flex>
          </Card>

        </Segment>

        <Segment
          content="Menu"
          inverted
          styles={{
            gridColumn: 'span 2',
            backgroundColor: "rgba(155, 155, 155, 0)",
            boxShadow: 'none'
          }}
        >
          <Card aria-roledescription="card avatar"
            elevated
            onClick={() => window.location.href = "/Saved-Profiles"}
            inverted
            className="Cards"
            style={{ backgroundColor: "#fcfcfc", width: "70%", marginLeft: "40px" }}>
            <Flex gap="gap.small" column fill vAlign="stretch" space="around" >

              <div className="card-head">
                Refer from Saved Profiles
              </div>

              <CardBody>

                <div className="info-content">
                  <Divider />
                  <br />
                  <AttendeeIcon /> &nbsp;&nbsp;Review, Update or Refer Directly from saved profiles
                </div>
              </CardBody>

            </Flex>
          </Card>

        </Segment>
        <Segment
          inverted
          styles={{
            gridColumn: 'span 4 ',
            backgroundColor: "rgba(155, 155, 155, 0)",
            boxShadow: 'none'
          }}
        >

        </Segment>
      </Grid>


      <Form onSubmit={(e) => { sendForm(e) }} ref={profileForm}>
        <Grid columns="repeat(4, 1fr)" rows="550px 470px 100px" >

          <Segment
            inverted
            styles={{
              gridColumn: 'span 4',
              backgroundColor: "rgba(155, 155, 155, 0)",
              boxShadow: 'none'
            }}
          >
            <Divider id="create-refer" />
            <br />
            <br />
            <div className="Intro">
              Forgot to refer and now your friends are after you? <br />
              Don't worry, we got you covered! Just upload a resume and we'll auto-populate it for you
            </div>
            <br />
            <br />
            <br />
            <Card aria-roledescription="card avatar"
              elevated
              inverted
              size='large'
              className="Cards1"
              style={{ backgroundColor: "#fcfcfc", height: "310px", width: "65%", marginLeft: "10px", margin: "auto" }}>

              <Flex gap="gap.small" column vAlign="stretch" space="between" >
                <CardHeader>
                  <Text content="Upload Resume/LinkedIn" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />
                <CardBody>
                  <br />
                  <small id="RandInfo" style={{ float: "right" }}>Either upload the candidate's resume or provide a link to their LinkedIn profile.</small>

                  <br />
                  <div class="file-input">
                    <input name="uploadResume" type="file" id="uploadResume" onChange={changeHandler} className="uploadResume" />
                    <label for="uploadResume">Upload Resume</label>
                    {/* <FormInput htmlFor="customFile" icon={<FilesPdfIcon size="large" />} fluid style={{ fontFamily: "Segoe UI", margin: "auto" }} label="Upload Resume" name="file" type="file" id="uploadResume" onChange={changeHandler} className="uploadResume" placeholder=""></FormInput> */}
                  </div>

                  {AlertResume
                    ? <Banner
                      title="Resume Uploaded"
                      css={{
                        backgroundColor: "rgba(173, 210, 173, 0.7)",
                        height: "30px",
                        width: "10rem",
                        position: "absolute",
                        bottom: "7.5rem",
                        left: "11rem"
                      }}
                      visibleTime={1500}
                    />
                    : <></>
                  }
                  {selectedAutofill
                    ? <Loader label="Autofilling..." labelPosition="end" size="small" inline
                      style={{
                        position: "absolute",
                        right: "13rem",
                        bottom: "7.8rem"
                      }} />
                    : <></>
                  }
                  {selectedAutofillComplete
                    ? <Banner
                      title="Autofill Complete"
                      css={{
                        backgroundColor: "rgba(173, 210, 173, 0.7)",
                        height: "30px",
                        width: "10rem",
                        position: "absolute",
                        left: "27rem",
                        bottom: "0rem"
                      }}
                      visibleTime={1500}
                    />
                    : <></>
                  }
                  <br />
                  <br />

                  <FormInput label="Upload LinkedIn Profile" type="text" id="uploadLinkedIn" placeholder="Enter profile link" fluid style={{ paddingRight: "100px" }} /><br />
                </CardBody>
              </Flex>
            </Card>
          </Segment>

          <Segment
            inverted
            styles={{
              gridColumn: 'span 1',
              backgroundColor: "rgba(155, 155, 155, 0)",
              boxShadow: 'none'
            }}
          >
            <Card aria-roledescription="card avatar"
              elevated
              fluid
              inverted
              className="Cards1"
              style={{ backgroundColor: "#fcfcfc", margin: "auto" }}>

              <Flex gap="gap.small" column fill vAlign="stretch" space="around" >
                <CardHeader>
                  <Text content="Primary Information" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />
                <CardBody>

                  <FormInput label="First Name" {...FirstName.values} type="text" name="FirstName" id="FirstName" aria-describedby="First Name" placeholder="" required inline fluid /><br />

                  <FormInput label="Last Name" {...LastName.values} type="text" name="LastName" id="LastName" aria-describedby="Last Name" placeholder="" required inline fluid /><br />

                  <FormInput label="Your Email" {...InputEmail.values} name="InputEmail" id="InputEmail" type="email" aria-describedby="emailHelp" placeholder="" inline required fluid /><br />

                  <FormInput label="Mobile No." {...MobileNo.values} name="MobileNo" id="MobileNo" type="text" aria-describedby="Mobile Number" placeholder="" inline required fluid /><br />

                  <label htmlFor="Location">Location*</label>
                  <select {...Location.values} name="Location" id="Location" aria-describedby="Location" placeholder="Enter Location" style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                    {Locations}
                  </select>

                </CardBody>
              </Flex>
            </Card>

          </Segment>

          <Segment
            styles={{
              gridColumn: 'span 1',
              backgroundColor: "rgba(155, 155, 155, 0)",
              boxShadow: 'none'
            }}
          >
            <Card aria-roledescription="card avatar"
              elevated
              inverted
              fluid
              id="ProfessionalCard"
              className="Cards1"
              style={{ backgroundColor: "#fcfcfc", margin: "auto" }}>

              <Flex gap="gap.small" column fill vAlign="stretch" space="around" >
                <CardHeader>
                  <Text content="Professional Information" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />
                <CardBody>

                  <FormInput label="Search for Job IDs" name="Job" type="text" id="Job" aria-describedby="Search for Job IDs" placeholder="" style={{ margin: "5px 0 5px 0" }} onChange={searchJob} fluid />
                  <p id="jobValidation" style={{ fontStyle: "italic" }}></p><br />

                  <label htmlFor="Position">Which job profile are you referring the candidate?*</label>
                  <select name="Position" id="Position" aria-describedby="Job Profile" placeholder="" required style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                    {Profiles}
                  </select>
                  <br />
                  <br />

                  <FormRadioGroup name="isEndorsed" id="isEndorsed" label="Do you endorse this person and recommend them as a hire?*" vertical required defaultCheckedValue="true" items={EndorseItems} style={{ fontFamily: "Segoe UI", color: "#484644" }} />
                  <br />


                </CardBody>
              </Flex>
            </Card>

          </Segment>

          <Segment
            styles={{
              gridColumn: 'span 1',
              backgroundColor: "rgba(155, 155, 155, 0)",
              boxShadow: 'none'
            }}
          >

            <Card aria-roledescription="card avatar"
              elevated
              fluid
              inverted
              className="Cards1"
              style={{ backgroundColor: "#fcfcfc", margin: "auto" }}>

              <Flex gap="gap.small" column fill vAlign="stretch" space="between" >
                <CardHeader>
                  <Text content="Secondary Information" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />

                <CardBody>
                  <br />

                  <label htmlFor="Relation">How do you know this person?*</label>
                  <select name="Relation" id="Relation" aria-describedby="Relation" placeholder="" style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                    <option value={1}>I don't know this person directly</option>
                    <option value={2}>I know this person, but haven't worked with them</option>
                    <option value={3}>I went to college/university with this person</option>
                    <option value={4}>I have worked with this person before</option>
                  </select>
                  <br />
                  <br />

                  <FormRadioGroup name="isUniversity" id="isUniversity" label="Is your referral a current university student or recent graduate (within last 12 months)?*" vertical required defaultCheckedValue="true" items={UnivItems} style={{ fontFamily: "Segoe UI", color: "#484644" }} />
                  <div>
                    <br /><br /><br /><br /><br /><br />
                  </div>
                </CardBody>
              </Flex>
            </Card>


          </Segment>

          <Segment
            styles={{
              gridColumn: 'span 1',
              backgroundColor: "rgba(155, 155, 155, 0)",
              boxShadow: 'none'
            }}
          >

            <Card aria-roledescription="card avatar"
              elevated
              fluid
              inverted
              className="Cards1"
              style={{ backgroundColor: "#fcfcfc", margin: "auto", right: "10px" }}>

              <Flex gap="gap.small" column fill vAlign="stretch" space="around" >
                <CardHeader>
                  <Text content="Additional Information" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />
                <CardBody >
                  <FormTextArea
                    placeholder="Max 2000 characters..."
                    {...About.values} name="About" id="About"
                    maxLength={2000}
                    label="Please provide additional information regarding the candidate’s skills etc."
                    fluid
                    style={{ height: "100px" }}
                  />
                  <br />
                  <br />

                  <FormInput fluid label="Referral Campaign Code" type="text" name="Code" id="Code" aria-describedby="Referral campaign code" placeholder="Enter Code here" inline /><br />
                  <div>
                    <br /><br /><br /><br />
                  </div>
                </CardBody>

              </Flex>
            </Card>

          </Segment>

          <Segment
            inverted
            styles={{
              gridColumn: 'span 4',
              backgroundColor: "rgba(155, 155, 155, 0)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button type="submit" secondary>Save Profile</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button primary onClick={handleClickEvent}>Save & Submit</Button>
              {saveProfile
                ? <Banner
                  title="Profile Saved"
                  css={{
                    backgroundColor: "rgb(173, 210, 173)",
                    height: "30px",
                    width: "10rem",
                    position: "absolute",
                    left: "28rem",
                    color: "green"
                  }}
                  visibleTime={1500}
                />
                : <></>
              }
              {referCall
                ? <Banner
                  title="Referred Successfully"
                  css={{
                    backgroundColor: "rgba(173, 210, 173, 0.7)",
                    height: "30px",
                    width: "12rem",
                    position: "absolute",
                    right: "24rem",
                    color: "green"
                  }}
                  visibleTime={1500}
                />
                : <></>
              }
            </div>

          </Segment>


        </Grid>
      </Form>

    </div>
  )
}