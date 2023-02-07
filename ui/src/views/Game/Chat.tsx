import { Autocomplete, Box, Button, createFilterOptions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ExtendList, FilterOptionsState, Grid, List, ListItem, ListItemText, ListTypeMap, MenuItem, Paper, Select, TextField } from "@mui/material";
import { Fragment, KeyboardEventHandler, useEffect, useRef, useState } from "react";

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
	name: string;
	access: "public" | "private" | "password";
	password?: string;
}

var arr: chatRoom[] = [{name: "public", access: "public"}];
  
const filter = createFilterOptions<chatRoom>();

export default function Chat() {
	const tmpMsgDto: messagesDto = {};

	const [ room, setRoom ] = useState<string>("public");
	const [ inputChat, setInputChat ] = useState<string>();
	const [ messages, setMessages ] = useState<Array<messagesDto>>([{user: "", message: "", room: "",}]);
	const [ selection, setSelection ] = useState<chatRoom | undefined>(arr[0]);
	const [open, toggleOpen] = useState(false);
	const [dialogValue, setDialogValue] = useState<chatRoom>({name: '', access: 'public', password: ''});

	const scrollRef = useRef<HTMLLIElement | null>(null);

	const handleChange = (e: any) => {
		setInputChat(e.target.value);
	};

	let pwDisable: boolean = true; 

	const handleSelect = (e: any, newValue: any, reason: any) => {
		const isExisting = arr.some((option: chatRoom) => room === option.name);
		if (!isExisting)
		{
			setDialogValue({name: room, access: 'public', password: ''})
			toggleOpen(true);
		}
		else
			setSelection(newValue);
	};

	const handleSubmit = (e: any) => {
		if (e.key === "Enter")
		{
			tmpMsgDto.message = inputChat;
			tmpMsgDto.user = "test";
			messages.push(tmpMsgDto);
			// send message
			setInputChat("");
		}
	};

	const handleFormSubmit = (e: any) => {
		e.preventDefault();
		arr.push({name: dialogValue.name, access: dialogValue.access, password: dialogValue.password});
		setDialogValue({name: '', access: 'public', password: ''});
		toggleOpen(false);
		setSelection(arr.find(element => element.name === dialogValue.name))
	};
	
	const listMessages = messages.map((messagesDto: messagesDto, index) => {
		if (messagesDto.message !== "" && messagesDto.user !== "")
		{
			return (
					<ListItem disablePadding sx={{pl: '5px'}} ref={scrollRef} key={index}>
						<ListItemText primary={messagesDto.user + ": " + messagesDto.message}/>
					</ListItem>
			);	
		}	
	});

	const handleAccessChange = (e: any) => {
		let tmpCR: chatRoom = {name: dialogValue.name, access: e.target.value, password: dialogValue.password};
		if (tmpCR.access !== 'password')
		{
			tmpCR.password = "";
			pwDisable = true;
		}
		else
			pwDisable = false;
		setDialogValue(tmpCR);
	};

	const handleClose = (e: any) => {
		setDialogValue({name: '', access: 'public', password: ''});
		toggleOpen(false);
	};

	useEffect(() => {
		if  (scrollRef.current)
			scrollRef.current.scrollIntoView();
	});

	return (
		<>
			<Paper elevation={4}>
				<Box>
					<Grid>
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
							<Autocomplete
								size='small'
								freeSolo
								value={selection}
								onChange={handleSelect}
								renderInput={(params: any) => (
								<TextField {...params} label="Room"
									onChange={e => {
										setRoom(e.target.value);
									}}
									onKeyDown={e => {
										if (e.key === "Enter")
										{
											if (room && room !== "")
											{
												const isExisting = arr.some((option: chatRoom) => room === option.name);
												if (!isExisting)
												{

												}	
											}
										}
									}}/>
								)}
								options={arr}
								filterOptions={(options: any, params) => {
								const filtered = filter(options, params);

								const inputValue = params.inputValue;

								const isExisting = options.some((option: string) => inputValue === option);
								if (inputValue !== '' && !isExisting) {
									filtered.push({name: "Add '" + inputValue + "'", access: "public"});
								}

								return filtered;
								}}
								selectOnFocus
								clearOnBlur
								handleHomeEndKeys
								getOptionLabel={(option) => {
									if (typeof option !== 'string')
										return option.name;
									return option;
								}}
								renderOption={(props, option) => <li {...props}>{option.name}</li>}
							/>
							<>
								<Dialog open={open} onClose={handleClose}>
									<form onSubmit={handleFormSubmit}>
									<DialogTitle>Create new channel</DialogTitle>
									<DialogContent>
										<DialogContentText>
										Please enter channel name, accessability and password.
										</DialogContentText>
										<TextField
										autoFocus
										margin="dense"
										id="name"
										value={dialogValue.name}
										onChange={(event) =>
											setDialogValue({
											...dialogValue,
											name: event.target.value,
											})
										}
										label="name"
										type="text"
										variant="standard"
										/>
										<Select margin="dense" label="access" type="string" variant="standard" value={dialogValue.access} onChange={handleAccessChange}>
											<MenuItem value="public">public</MenuItem>
											<MenuItem value="private">private</MenuItem>
											<MenuItem value= "password">password</MenuItem>
										</Select>
										<TextField
										disabled={pwDisable}
										margin="dense"
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
							</>
						</Grid>
						<Grid item>
							<TextField  size='small' label='Chat'
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