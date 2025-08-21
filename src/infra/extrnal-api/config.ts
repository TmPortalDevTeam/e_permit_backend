import axios from "axios";
import { getEnv } from '@src/infra/env/service';

const PERMIT_API_URL = getEnv('E_PERMIT_API');
const TUGDK_API_URL = getEnv('TUGDK_API');

const timeout: number = 10000; // 10 seconds
const headers = {
    "Content-Type": "application/json"
}

export const apiEpermit = axios.create({
    baseURL: PERMIT_API_URL,
    headers,
    timeout,
});

export const apiTUGDK = axios.create({
    baseURL: TUGDK_API_URL,
    headers,
    timeout,
});