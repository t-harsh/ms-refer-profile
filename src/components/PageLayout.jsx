import React from "react";
import { ChannelShareIcon } from '@fluentui/react-icons-northstar'
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import "./../styles.css"

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <nav className="nav" bg="primary" variant="dark" >
            <ul>
                <Link to="/" className="site-title">
                    <ChannelShareIcon className="icon"/>
                    <b> MS Referrals </b>
                </Link>
                
                    <CustomLink to="/Refer">Refer</CustomLink>
                    <CustomLink to="/Saved-Profiles">Saved Profiles</CustomLink>

            </ul>
                {isAuthenticated ? <SignOutButton /> : <SignInButton />}
            </nav>
            <h5><center></center></h5>
            <br />
            <br />
            {props.children}
        </>
    );
};

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}
