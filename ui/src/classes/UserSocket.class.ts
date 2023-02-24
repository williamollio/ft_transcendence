import { Socket } from "socket.io-client";
import { initSocket } from "../services/initSocket.service";

export class UserSocket {
	socket: Socket;

	constructor(){
		this.socket = initSocket("http://localhost:8888");
	}
}