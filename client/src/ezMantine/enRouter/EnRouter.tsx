import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {encodeDecode, updateSessionStore} from "@/util";
import {FetchApi} from "@/api/FetchApi.ts";

export default function EnRouter() {
    console.log('EnRouter');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");
        const user_id = searchParams.get("user_id");
        const redirectUrl = searchParams.get("url") || '';

        async function verifySession() {
            const response = await FetchApi(
                'user/verify/2fa',
                'GET',
                null,
                {user_code: code, user_id}
            )

            if (response.success) {
                const token = await encodeDecode(response.auth.token, 'encode');
                updateSessionStore("potasio", token); // store credentials
                navigate(redirectUrl, {replace: true});
            }
        }

        verifySession().then()
    }, []);

    return null;
}