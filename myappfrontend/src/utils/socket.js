import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // ✅ This should now work

export default socket;
