import React from "react";
import { useMsal } from "@azure/msal-react";
import { BanIcon, GeofenceLeavesIcon } from '@fluentui/react-icons-northstar';
import { Button, Flex } from '@fluentui/react-northstar';
import "./../styles.css";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }
    return (
        <Button icon={<GeofenceLeavesIcon size='large' rotate={-90}/>} content="Sign Out" iconPosition="before" onClick={() => handleLogout("popup")} primary className="ml-auto" />
    )
}