// login.jsx
import React from 'react';
import {StytchLogin} from '@stytch/nextjs';

const Login = () => {

    // const REDIRECT_URL = process.env.REDIRECT_URL || "https://delphi.sibylline.xyz/authenticate"
    const REDIRECT_URL = "http://localhost:3000/authenticate"

    const config = {
        "products": [
            "oauth"
        ],
        "oauthOptions": {
            "loginRedirectURL": "http://localhost:3000/authenticate",  //TODO: Comment this line out
            "providers": [
                {
                    "type": "github",
                    "custom_scopes": ['repo']
                }
            ]
        }
    };
    const styles = {
        "container": {
            "backgroundColor": "#FFFFFF",
            "borderColor": "#ADBCC5",
            "borderRadius": "8px",
            "width": "400px"
        },
        "colors": {
            "primary": "#19303D",
            "secondary": "#5C727D",
            "success": "#0C5A56",
            "error": "#8B1214"
        },
        "buttons": {
            "primary": {
                "backgroundColor": "#19303D",
                "textColor": "#FFFFFF",
                "borderColor": "#19303D",
                "borderRadius": "4px"
            },
            "secondary": {
                "backgroundColor": "#FFFFFF",
                "textColor": "#19303D",
                "borderColor": "#19303D",
                "borderRadius": "4px"
            }
        },
        "fontFamily": "Monaco",
        "hideHeaderText": false,
        "logo": {
            "logoImageUrl": ""
        }
    }
    return <StytchLogin config={config} styles={styles}/>;
}

export default Login;