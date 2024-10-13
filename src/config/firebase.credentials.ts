import dotenv from 'dotenv';
dotenv.config();

let apiCredentials = {
    api_key: process.env.NEXT_PUBLIC_API_KEY as string,
    auth_domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN as string,
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    storage_bucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
    messaging_sender_id: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID as string,
    app_id: process.env.NEXT_PUBLIC_APP_ID as string
}

if (process.env.NEXT_PUBLIC_ENV === 'test') {
    apiCredentials = {
        api_key: process.env.NEXT_PUBLIC_API_TEST_KEY as string,
        auth_domain: process.env.NEXT_PUBLIC_AUTH_TEST_DOMAIN as string,
        project_id: process.env.NEXT_PUBLIC_PROJECT_TEST_ID as string,
        storage_bucket: process.env.NEXT_PUBLIC_STORAGE_TEST_BUCKET as string,
        messaging_sender_id: process.env.NEXT_PUBLIC_MESSAGING_TEST_SENDER_ID as string,
        app_id: process.env.NEXT_PUBLIC_APP_TEST_ID as string,
    }
}

export default apiCredentials