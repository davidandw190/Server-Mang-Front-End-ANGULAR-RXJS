import { Server } from "./server";

// equivalent to the response from the backend implementation
export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data: { servers?: Server[], server?: Server }; // we can receive either a single
                                                   // object or an array of objects
}
