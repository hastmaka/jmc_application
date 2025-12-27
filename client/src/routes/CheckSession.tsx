import {LoginController} from "@/view/login/LoginController.ts";
import React, {useEffect, useState} from "react";
import {getFromSessionStore} from "@/util/updateLocalStore.ts";
import {LOGIN_USER} from "@/api/action/ACTIONS.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";

function CheckSession({children}: { children?: React.ReactNode }) {
    const {user} = LoginController
    const [validSession, setValidSession] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const isValid = getFromSessionStore('potasio');
            if (isValid) {
                if (Object.keys(user).length === 0) {
                    try {
                        await LOGIN_USER();
                        setValidSession(true);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (e: Error | any) {
                        window.navigate('/login');
                    }
                } else {
                    setValidSession(true);
                }
            } else {
                window.navigate('/login');
            }
        };
        checkSession().then()
    }, []);

    if (!validSession) return <EzLoader h='100vh' centerProps={{flex: 1}}/>;

    return children
}

export default CheckSession;