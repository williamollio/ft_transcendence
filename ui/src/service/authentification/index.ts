import axios from 'axios'
import {stringify} from "querystring";

const url = "http://localhost:8080/"

type User = {
    username: string
    password: string
}
const authentificationService = () => {

    const Users = {
        async signin(): Promise<User> {
            return {username: 'username', password: 'password'}
        },

        async signup(): Promise<User> {
            return {username: 'username', password: 'password'}
        }
    }
}

export default authentificationService