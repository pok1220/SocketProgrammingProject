import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'http://socket-program-group11.us-east-1.elasticbeanstalk.com' : 'http://socket-program-group11.us-east-1.elasticbeanstalk.com';
// const URL = process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:8080';

export const socket = io(URL);