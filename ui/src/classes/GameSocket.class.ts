import { Socket } from "socket.io-client";
import { initSocket } from "../services/initSocket.service";

export class GameSocket {
	socket: Socket;

	constructor(){
		this.socket = initSocket("http://localhost:4444", null);
	}
}