import { Button, CardHeader, CardBody, Card, Flex, Text, Grid, Segment, Loader, Carousel, Header } from "@fluentui/react-northstar";
import { Form, FormTextArea, FormInput, FormRadioGroup, Divider } from '@fluentui/react-northstar';
import { MeetingNewIcon, AttendeeIcon, RetryIcon, ArrowUpIcon } from '@fluentui/react-icons-northstar'
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
import "./Carousel.css";
import { AffindaCredential, AffindaAPI } from "@affinda/affinda";


export function Design() {

  //Initializing hooks

  const { instance, accounts } = useMsal();
  const [token, setToken] = useState("");
  const profileForm = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAutofill, setAutofill] = useState(false);
  const [selectedAutofillComplete, setAutofillComplete] = useState(false);
  const [AlertResume, setAlertResume] = useState(false);
  const [saveProfile, setSaveProfile] = useState(false);
  const [referCall, setReferCall] = useState(false);
  const [selectedisEndorsed, setisEndorsed] = useState(true);
  const [selectedisUniversity, setisUniversity] = useState(true);
  const [isSubmit, setisSubmit] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState(null);
  const [loadCarousel, setLoadCarousel] = useState(false);

  // Initializing useInputState hook

  const FirstName = useInputState();
  const LastName = useInputState();
  const InputEmail = useInputState();
  const MobileNo = useInputState();
  const Location = useInputState();
  const About = useInputState();
  const Job = useInputState();



  //Drop down items

  let locationCountryCodes = locations();
  let Locations = locationCountryCodes.map((location) =>
    <option value={location.key}>{location.text}</option>
  );


  let profilesData = profiles();
  let Profiles = profilesData.map((profile) =>
    <option value={profile.key}>{profile.text}</option>
  );

  //Radio Button items

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


  var skills = '';

  //Generate guid id for Resume

  function generateGuid() {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  const credential = new AffindaCredential("11c48462d4df64e057ef2ce45fc5e07dcb3977b2");
  const client = new AffindaAPI(credential);


  // Upload Resume Functions

  const changeHandler = async (event) => {

    setAlertResume(true);
    setLoadCarousel(true);
    setAutofill(true);

    // Generating Id Token for the Refer API using MSAL Provider

    instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    }).then((response) => {
      setToken(response.idToken);
    });

    //Calling Affinda API and parsing resume

    client.createResume({ file: event.target.files[0] }).then((result) => {
      console.log("Returned data:");
      console.dir(result);

      //Autofilling

      FirstName.handleSet(result.data?.name?.first);
      LastName.handleSet(result.data?.name?.last);
      InputEmail.handleSet(result.data?.emails?.[0]);
      MobileNo.handleSet(result.data?.phoneNumbers?.[0]);
      About.handleSet(result.data?.profession);
      result.data?.skills.map((item) => {
        skills = skills + ',' + item.name;
      });
      skills = skills.substring(1);
      skills = "\"" + skills + "\"";
      getRecommendedJobs(skills);

      setAutofill(false);
      setAutofillComplete(true);

    }).catch((err) => {
      console.log("An error occurred:");
      console.error(err);
    });

    const target = event.target;
    setSelectedFile(target.files[0]);


  };

  //Get Recommended Job based on skills in resume

  const getRecommendedJobs = (skills) => {

    //Temporary Access Token for the Recommendations API
    const bearer = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJmNTEwNzM1YS02YzlhLTQ1NDEtODgyOC03YWQyN2QyOTg5NzYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE2NTgyMzY1MTQsIm5iZiI6MTY1ODIzNjUxNCwiZXhwIjoxNjU4MjQxNzQ5LCJhaW8iOiJBWFFBaS84VEFBQUFnSFhnT1VZU2ZnNW9Ja3gyYkphZHNiTzI4OHlMNkNPRFJrY0ZVQVM3Z3Ixdnhyd3d4bjUrb1RxRWgyMTNkbDNGUm5uUXJGWXVvRFQ0T3I5dnRMQlVudzRUSlVHMDRNRFJFQjlTcytqcTlZNkk0YnF1d0xtdG1jSG5RY3hVYlJKKzVZdkYxTXlPakN2cnYxY1JTT2RhU0E9PSIsImF6cCI6ImY1MTA3MzVhLTZjOWEtNDU0MS04ODI4LTdhZDI3ZDI5ODk3NiIsImF6cGFjciI6IjAiLCJuYW1lIjoiSGFyc2ggU2hyaXZhc3RhdmEiLCJvaWQiOiI4ZWNhYzIwZi04MDE1LTRjNmQtOTk3NC03NTMwNDMyZTQ0ZjQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0LWhhcnNoc2hAbWljcm9zb2Z0LmNvbSIsInJoIjoiMC5BUUVBdjRqNWN2R0dyMEdScXkxODBCSGJSMXB6RVBXYWJFRkZpQ2g2MG4wcGlYWWFBTmMuIiwic2NwIjoiRGlyZWN0b3J5LlJlYWQuQWxsIFVzZXIuUmVhZCBVc2VyLlJlYWQuQWxsIFVzZXIuUmVhZEJhc2ljLkFsbCIsInN1YiI6IjFVREpNMktiTjNDT1V3WjQ4Rmx6Q1NZZU81WXFPOExJVEViMDdzbXpYTzQiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1cG4iOiJ0LWhhcnNoc2hAbWljcm9zb2Z0LmNvbSIsInV0aSI6InJxMVdJdHZUV1VpREVLR2RkZXNJQUEiLCJ2ZXIiOiIyLjAifQ.qU2P42JpLhZyWxLYW-fqg_H0DQlMgz_MJyirlThOSGGAB-59rBxuf_XX1_B59gm75mChcpSar8pMn3zO5OM8W6NwgiXO1saWPA7-CUc5vsIXytSzeuwvKUeSSMYutZSEquASB0NLOOHkSrb06J-kLhMCxXBCFzGP6GJa6pdNRqqHpZrpUjytI55aLYkvUSIo-FAh7Swpw81Bk9Qka13wo0K5C_dUkHIW6BdibTjMGf23dbyJ1scJY6NhvjHsbh7myJ0XwzFoRhgYmAb3aFmgHnoNaozhuAiZRsIt5GRH4nPSwRlVKxw-hVxkTbWGjVNj_80N_esqKblt-AxJJ2P8VA";
    console.log("here = ", skills);

    fetch('https://msrecruitdev.microsoft.com/interviewservice/v1/TM/jobRecommendationsBySkills', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearer
      },
      method: 'POST',
      body: skills,
    }).then(response => response.json())
      .then(data => {
        setRecommendedJobs(data);
        setLoadCarousel(false);
      });
  }

  //Job Recommendation Carousel

  function JobCarousel() {

    const tabAriaLabel = {
      job1: 'job1',
      job2: 'job2',
      job3: 'job3'
    }

    // Fill Job input Field

    const fillRecommendedJob = (item) => {
      Job.handleSet(item.externalJobOpeningId);
    }


    const carouselItems = recommendedJobs.map((item) => ({

      key: 'Recommended Job',
      id: 'Recommended Job',
      content: (
        <div>

          <Text>
            <Header style={{ fontSize: "17px" }} align="center" > {item.jobTitle} </Header>
            <Divider />
            <p><b>Location :</b> {item.jobLocation.City} , {item.jobLocation.State} </p>
            <div style={{ display: "inline-flex" }}>
              <p><b>Job Id :</b> {item.externalJobOpeningId} </p>
              <Button style={{ left: "50%" }} type="button" onClick={
                () => fillRecommendedJob(item)
              }>Select</Button>
            </div>
          </Text>

        </div>
      ),
      'aria-label': 'Recommendation card',
    })

    )

    return (
      <Carousel
        className="carouselCard"
        navigation={{
          'aria-label': 'Job cards',
          type: Button,
          items: carouselItems.map((item, index) => ({
            key: item.id,
            'aria-label': tabAriaLabel[item.id],
            'aria-controls': item.id,
          })),
        }}
        items={carouselItems}
        getItemPositionText={(index, size) => `${index + 1} of ${size}`}
      />
    )
  }

  //Radio button field inputs

  const isEndorsed = true;
  const changeisEndorsed = () => {
    isEndorsed = !isEndorsed;
    setisEndorsed(isEndorsed);
  }

  const isUniversity = true;
  const changeisUniversity = () => {
    isUniversity = !isUniversity;
    setisUniversity(isUniversity);
  }

  //To prevent other button clicks to submit form

  const changeSubmit = () => {
    setisSubmit(true);
  }

  //Submit the form and create a Profile

  const sendForm = async (e) => {
    if (isSubmit == true) {

      const { FirstName, LastName, InputEmail, MobileNo, Location, Relation, About, Code } = e.target

      const ResumeUri = generateGuid();


      await fetch('https://referralprofilesv2-api.azure-api.net/v1/profiles/create', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          firstName: FirstName?.value,
          lastName: LastName?.value,
          emailId: InputEmail?.value,
          mobileNo: MobileNo?.value,
          location: Location?.value,
          relation: Relation?.value,
          code: Code?.value,
          isEndorsed: selectedisEndorsed.toString(),
          isUniversity: selectedisUniversity.toString(),
          resumeUri: ResumeUri

        })
      }).then(response => response.json())
        .then(setSaveProfile(true));
      pageReload();
      setisSubmit(false);
    }
  }

  // Reload the page

  const pageReload = () => {
    setTimeout(function () { location.reload(); }, 3000);
  }

  //Call the Refer API

  const handleClickEvent = () => {


    setisSubmit(true);
    let form = profileForm.current;
    const ResumeUri = generateGuid();
    const formData = new FormData();
    formData.append('firstName', form['FirstName'].value);
    formData.append('lastName', form['LastName'].value);
    formData.append('candidateEmail', form['InputEmail'].value);
    formData.append('candidatePhone', form['MobileNo'].value);
    formData.append('location', parseInt(form['Location'].value));
    formData.append('profile', form['Position'].value);
    formData.append('acquaintanceLevel', parseInt(form['Relation'].value));
    formData.append('isEndorsed', parseInt(selectedisEndorsed ? 1 : 0));
    formData.append('isUniversityStudent', selectedisUniversity);
    formData.append('additionalInformation', form['About'].value);
    formData.append('campaignCode', form['Code'].value);
    formData.append('resumeFile', selectedFile);
    formData.append('resumeUri', ResumeUri);



    var bearer = 'Bearer ' + token;
    console.log("Testing bearer = " + bearer);

    fetch('https://hrgtareferservicedev.azurewebsites.net/v2/refer', {
      method: 'POST',
      headers: {
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
    pageReload();
  }

  //Smoothly Scroll down

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

  //Focus to an input field

  function jobScrollFocus() {
    scrollToSmoothly(document.getElementById("ProfessionalCard").offsetTop, 1500);
    document.getElementById("Job").focus();
  }

  // Use focus function 

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
            id="top-card"
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
                  <MeetingNewIcon />&nbsp;&nbsp; Referring your friends just clicks away
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
            onClick={() => window.location = "/Saved-Profiles"}
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
        <Grid columns="repeat(4, 1fr)" rows="550px 480px 100px" >

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

              <Flex gap="gap.small" column vAlign="stretch" space="between" align="center">
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
                  </div>

                  {AlertResume
                    ? <Banner
                      title="Resume Uploaded"
                      css={{
                        backgroundColor: "rgba(173, 210, 173, 0.7)",
                        height: "30px",
                        width: "10rem",
                        position: "absolute",
                        bottom: "45%",
                        left: "18%",
                        color: "rgb(58, 109, 78)",
                        fontWeight: "550"
                      }}
                      visibleTime={1500}
                    />
                    : <></>
                  }
                  {selectedAutofill
                    ? <Loader label="Autofilling..." labelPosition="end" size="small" inline
                      style={{
                        position: "absolute",
                        right: "43%",
                        bottom: "0%"
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
                        left: "43%",
                        bottom: "0%",
                        color: "rgb(58, 109, 78)",
                        fontWeight: "550"
                      }}
                      visibleTime={2000}
                    />
                    : <></>
                  }
                  <br />
                  <br />

                  <FormInput label="Upload LinkedIn Profile" type="text" id="uploadLinkedIn" placeholder="Enter profile link" fluid style={{ paddingLeft: "100px", paddingRight: "100px" }} /><br />
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

              <Flex gap="gap.small" column vAlign="stretch" space="around" >
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

              <Flex gap="gap.small" column vAlign="stretch" space="around" >
                <CardHeader>
                  <Text content="Professional Information" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />
                <CardBody>

                  <label htmlFor="Position">Job Profile*</label>
                  <select name="Position" id="Position" aria-describedby="Job Profile" placeholder="" required style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                    {Profiles}
                  </select>
                  <br />

                  <FormInput label="Search for Job IDs" {...Job.values} name="Job" type="text" id="Job" aria-describedby="Search for Job IDs" placeholder="" style={{ margin: "5px 0 5px 0" }} fluid />
                  <p id="jobValidation" style={{ fontStyle: "italic", color: "green", }}></p>


                  <div >Job Recommendations :</div>
                  {loadCarousel
                    ? <Loader size="small" style={{ marginTop: "10%" }} />
                    : <></>
                  }
                  {recommendedJobs
                    ? <JobCarousel />
                    : <Banner
                      title="Upload Resume and we'll Recommend the Best Jobs for you!"
                      css={{
                        backgroundColor: "rgba(243, 253, 194, 0.7)",
                        fontSize: "13px",
                        fontWeight: "500",
                        height: "30px",
                        width: "15rem",
                        marginTop: "10%",
                        marginLeft: "10%",
                      }}
                    />
                  }


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

              <Flex gap="gap.small" column vAlign="stretch" space="between" >
                <CardHeader>
                  <Text content="Secondary Information" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />

                <CardBody>


                  <label htmlFor="Relation">How do you know this person?*</label>
                  <select name="Relation" id="Relation" aria-describedby="Relation" placeholder="" style={{ margin: "5px 0 5px 0", height: "2rem", backgroundColor: "#F3F2F1", border: "none", padding: "0.2rem 0.4rem", fontFamily: "Segoe UI", color: "#484644" }}>
                    <option value={1}>I don't know this person directly</option>
                    <option value={2}>I know this person, but haven't worked with them</option>
                    <option value={3}>I went to college/university with this person</option>
                    <option value={4}>I have worked with this person before</option>
                  </select>
                  <br />



                  <FormRadioGroup name="isUniversity" id="isUniversity" label="Is your referral a current university student or recent graduate (within last 12 months)?*" vertical required defaultCheckedValue="true" onChange={changeisUniversity} items={UnivItems} style={{ fontFamily: "Segoe UI", color: "#484644" }} />
                  <br />


                  <FormRadioGroup name="isEndorsed" id="isEndorsed" label="Do you endorse this person and recommend them as a hire?*" vertical required defaultCheckedValue="true" items={EndorseItems} onChange={changeisEndorsed} style={{ fontFamily: "Segoe UI", color: "#484644" }} />

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

              <Flex gap="gap.small" column vAlign="stretch" space="around" >
                <CardHeader>
                  <Text content="Additional Information" weight="bold" size="large" align="center" />
                </CardHeader>
                <Divider />
                <br />
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
              <Button type="button" circular icon={<RetryIcon />} onClick={() => window.location.reload(false)} title="Reload" />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={changeSubmit} secondary>Save Profile</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button primary onClick={handleClickEvent}>Save & Submit</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="button" circular icon={<ArrowUpIcon />} onClick={() => scrollToSmoothly(document.getElementById("top-card").offsetTop, 500)} title="Go to the top" />
              {saveProfile
                ? <Banner
                  title="Profile Saved"
                  css={{
                    backgroundColor: "rgba(173, 210, 173, 0.7)",
                    height: "30px",
                    width: "10rem",
                    position: "absolute",
                    left: "28%",
                    color: "rgb(58, 109, 78)",
                    fontWeight: "550"
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
                    right: "23%",
                    color: "rgb(58, 109, 78)",
                    fontWeight: "550"
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