import React, { useState, useEffect } from 'react'
import { Grid, Segment, Button, Dialog, Divider } from "@fluentui/react-northstar";
import { ContactCardIcon, LightningIcon } from '@fluentui/react-icons-northstar'
import { Forms } from "./Forms";
import { FormsDirect } from "./FormsDirect";
import "./Deploy.css";


export function Deploy() {

  const [users, setUser] = useState([]);


  const fetchData = () => {
    fetch("https://referralprofilesv2-api.azure-api.net/v1/profiles")
      .then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
        setUser(data);
      })
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <div className="Intro">
        Review, Update and Refer or choose to Refer directly!
      </div>
      <br />
      <div className="top">
        <br></br>
        <table>
          <thead>
            <tr>
              <td>No.</td>
              <td>First Name</td>
              <td>Email Id</td>
              <td>Mobile No.</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {
              users.map((item, i) =>
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.firstName}</td>
                  <td>{item.emailId}</td>
                  <td>{item.mobileNo}</td>
                  <td><Dialog
                    content={<Forms item={item} />}
                    header="Review, Update and Refer"
                    trigger={<Button circular icon={<ContactCardIcon />} title="Review, Update and Refer" />}
                  />&nbsp;&nbsp;&nbsp;
                  <Dialog
                    content={<FormsDirect item={item} />}
                    cancelButton="Cancel"
                    header="Refer Directly"
                    trigger={<Button circular icon={<LightningIcon />} title="Refer Directly" />}
                  /></td>
                </tr>
              )
            }
          </tbody>

        </table>
      </div>
    </>
  )

}