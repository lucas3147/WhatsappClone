import dotenv from 'dotenv';
dotenv.config();

let apiCredentials = {
    api_key: process.env.API_KEY as string,
    auth_domain: process.env.AUTH_DOMAIN as string,
    project_id: process.env.PROJECT_ID as string,
    storage_bucket: process.env.STORAGE_BUCKET as string,
    messaging_sender_id: process.env.MESSAGING_SENDER_ID as string,
    app_id: process.env.APP_ID as string
}

if (process.env.NODE_ENV === 'test') {
    apiCredentials = {
        api_key: process.env.API_TEST_KEY as string,
        auth_domain: process.env.AUTH_TEST_DOMAIN as string,
        project_id: process.env.PROJECT_TEST_ID as string,
        storage_bucket: process.env.STORAGE_TEST_BUCKET as string,
        messaging_sender_id: process.env.MESSAGING_TEST_SENDER_ID as string,
        app_id: process.env.APP_TEST_ID as string,
    }
}

export default apiCredentials