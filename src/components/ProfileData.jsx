import React from "react";
import { Avatar, Card, Flex, Text } from '@fluentui/react-northstar'
import "./ProfileData.css"

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {
    console.log(props.graphData);

    return (
        <div id="profile-div">
            {/* <p><strong>First Name: </strong> {props.graphData.givenName}</p>
            <p><strong>Last Name: </strong> {props.graphData.surname}</p>
            <p><strong>Email: </strong> {props.graphData.userPrincipalName}</p>
            <p><strong>Id: </strong> {props.graphData.id}</p> */}
            <Card aria-roledescription="card avatar" className="Cards" style={{ backgroundColor: "white" }}>
                <Card.Header fitted>
                    <Flex gap="gap.small">
                        <Avatar
                            image="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/RobertTolbert.jpg"
                            label="Prodile picture"
                            name="Profile Pic"
                            status="unknown"
                        />
                        <Flex column>
                            <Text content={ props.graphData.givenName } weight="bold" />
                            <Text content={ props.graphData.surname } weight="bold" />
                            <Text content={ props.graphData.userPrincipalName } />
                            <Text content={ props.graphData.id } size="small" />
                        </Flex>
                    </Flex>
                </Card.Header>
            </Card>
        </div>
    );
};