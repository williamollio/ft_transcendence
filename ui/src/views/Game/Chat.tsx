import { Autocomplete, Box, createFilterOptions, ExtendList, FilterOptionsState, Grid, List, ListItem, ListItemText, ListTypeMap, Paper, TextField } from "@mui/material";
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

var arr: string[] = ["public"];
  
const filter = createFilterOptions<string>();

export default function Chat() {
	const tmpMsgDto: messagesDto = {};

	const [ room, setRoom ] = useState<string>("public");
	const [ inputChat, setInputChat ] = useState<string>();
	const [ messages, setMessages ] = useState<Array<messagesDto>>([{user: "", message: "", room: "",}]);
	const [ selection, setSelection ] = useState<string>(arr[0]);
	const scrollRef = useRef<HTMLLIElement | null>(null);

	const handleChange = (e: any) => {
		setInputChat(e.target.value);
	};

	const handleSelect = (e: any, newValue: any) => {
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
												const isExisting = arr.some((option: string) => room === option);
												if (!isExisting)
												{
													arr.push(room);
													setSelection(room);
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
									filtered.push(inputValue);
								}

								return filtered;
								}}
								selectOnFocus
								clearOnBlur
								handleHomeEndKeys
								getOptionLabel={(option) => {
									return option;
								}}
								renderOption={(props, option) => <li {...props}>{option}</li>}
							/>
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