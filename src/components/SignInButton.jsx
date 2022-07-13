import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import "./../styles.css";
import { ApprovalsAppbarIcon } from '@fluentui/react-icons-northstar';
import { Button, Flex } from '@fluentui/react-northstar';

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch(e => {
                console.log(e);
            });
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest).catch(e => {
                console.log(e);
            });
        }
    }
    return (
        <Button icon={<ApprovalsAppbarIcon />} content="Sign In" iconPosition="before" onClick={() => handleLogin("popup")} primary className="ml-auto" />
    )
}