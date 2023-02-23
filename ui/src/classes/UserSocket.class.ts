import { Socket } from "socket.io-client";
import { initSocket } from "../components/hook/initSocket";

export class UserSocket {
	socket: Socket;

	constructor(){
		this.socket = initSocket("http://localhost:8888");
	}
}