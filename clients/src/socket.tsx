import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const session= useSession()
const URL = process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:8080';

export const socket = io(URL, {
    auth: {
        token: "YOUR_JWT_TOKEN_HERE" // Replace with the actual token
    }
});
