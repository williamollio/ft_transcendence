import { Add, AirlineSeatLegroomReduced, PanoramaSharp } from "@mui/icons-material";
import { Autocomplete, Box, Button, createFilterOptions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ExtendList, FilterOptionsState, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListTypeMap, MenuItem, Paper, Select, Tab, Tabs, TextField } from "@mui/material";
import { Fragment, KeyboardEventHandler, ReactElement, SyntheticEvent, useEffect, useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';

export class messagesDto {
	user?: string;
	message?: string;
	room?: string;

	constructor(user: string, message: string, room: string){
		this.user = user;
		this.message = message;
		this.room = room;
	}
}

interface chatRoom {
	key: string;
	access: "public" | "private" | "password";
	password?: string;
	messages: messagesDto[];
}

var tabs: chatRoom[] = [{key: "public", access: "public", messages: []}]; 

export default function Chat() {
	const tmpMsgDto: messagesDto = {};


	const [ inputChat, setInputChat ] = useState<string>();
	const [ messages, setMessages ] = useState<Array<messagesDto>>(tabs[0].messages);
	const [ open, toggleOpen ] = useState(false);
	const [ dialogValue, setDialogValue ] = useState<chatRoom>({key: '', access: 'public', password: '', messages: []});
	const [ pwDisable, setPwDisable ] = useState<boolean>(true);
	const [ currentRoom, setCurrentRoom ] = useState(tabs[0]);

	const scrollRef = useRef<HTMLLIElement | null>(null);

	const handleChange = (e: any) => {
		setInputChat(e.target.value);
	};

	const handleSubmit = (e: any) => {
		if (e.key === "Enter")
		{
			tmpMsgDto.message = inputChat;	// }
			tmpMsgDto.user = "test";		// } all for testing
			messages.push(tmpMsgDto);		// }
			// send message
			setInputChat("");
		}
	};

	const handleFormSubmit = (e: any) => {
		e.preventDefault();
		setCurrentRoom(tabs[tabs.push({key: dialogValue.key, access: dialogValue.access, password: dialogValue.password, messages: dialogValue.messages}) - 1]);
		setMessages(dialogValue.messages);
		setDialogValue({key: "", access: "public", password: "", messages: []});
		toggleOpen(false);
	};
	
	const listMessages = messages.map((messagesDto: messagesDto, index) => {
		if (messagesDto && messagesDto.message !== "" && messagesDto.user !== "")
		{
			return (
				<ListItem disablePadding sx={{pl: '5px'}} ref={scrollRef} key={index}>
					<ListItemText primary={messagesDto.user + ": " + messagesDto.message}/>
				</ListItem>
			);	
		}	
	});

	const handleAccessChange = (e: any) => {
		let tmpCR: chatRoom = {...dialogValue, access: e.target.value};
		if (tmpCR.access !== 'password')
		{
			tmpCR.password = "";
			setPwDisable(true);
		}
		else
			setPwDisable(false);
		setDialogValue(tmpCR);
	};

	const handleClose = (e: any) => {
		setDialogValue({key: "", access: "public", password: "", messages: []});
		toggleOpen(false);
	};


	useEffect(() => {
		if  (scrollRef.current)
			scrollRef.current.scrollIntoView();
	});

	const handleRoomChange = (event: SyntheticEvent, newValue: chatRoom) => {
		setCurrentRoom(newValue);
	};

	const newRoom = () => {
		setDialogValue({key: "", access: "public", password: "", messages: []});
		toggleOpen(true);
	}

	return (
		<>
			<Paper elevation={4}>
				<Box sx={{
					width: '300px',
					height: '300px',
				}}>
					<Grid>
						<Grid item>
							<Tabs 
								value={currentRoom}
								onChange={handleRoomChange}
								variant="scrollable">
								{tabs.map((tab) => 
									<Tab value={tab} key={tab.key} label={tab.key} onClick={() => {
										setMessages(tab.messages);
									}}></Tab>
								)}
								<Tab icon={<AddIcon/>} onClick={newRoom}></Tab>
							</Tabs>
						</Grid>
						<Grid item>
							<List disablePadding
								sx={{
									maxWidth: 300,
									minWidth: 300,
									bgcolor: 'background.paper',
									position: 'relative',
									overflow: 'auto',
									maxHeight: 300,
									minHeight: 300,
								}}>
									{listMessages}
							</List>
						</Grid>
						<Grid item>
							<Dialog open={open} onClose={handleClose}>
								<form onSubmit={handleFormSubmit}>
								<DialogTitle>Create new channel</DialogTitle>
								<DialogContent>
									<DialogContentText>
										Please enter channel name, accessability and password.
									</DialogContentText>
									<TextField
										autoFocus
										id="name"
										value={dialogValue.key}
										onChange={(event) =>
											setDialogValue({
											...dialogValue,
											key: event.target.value,
											})
										}
										label="name"
										type="text"
										variant="standard"
									/>
									<Select label="access" type="string" variant="standard" value={dialogValue.access} onChange={handleAccessChange}>
										<MenuItem value="public">public</MenuItem>
										<MenuItem value="private">private</MenuItem>
										<MenuItem value= "password">password</MenuItem>
									</Select>
									<TextField
										disabled={pwDisable}
										id="name"
										value={dialogValue.password}
										onChange={(event) =>
											setDialogValue({
											...dialogValue,
											password: event.target.value,
											})
										}
										label="password"
										type="string"
										variant="standard"
									/>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleClose}>Cancel</Button>
									<Button type="submit">Add</Button>
								</DialogActions>
								</form>
							</Dialog>
						</Grid>
						<Grid item>
							<TextField  size='small' label='Chat' sx={{width: '300px',}}
								value={inputChat}
								onChange={handleChange}
								onKeyDown={handleSubmit}
							/>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</>
	);
};