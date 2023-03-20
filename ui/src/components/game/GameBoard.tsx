import { useState } from "react";

export default function GameBoard(){
	const [playerLeftPos, setPlayerLeftPos] = useState<number>();
	const [playerRightPos, setPlayerRightPos] = useState<number>();
	const [ballPos, setBallPos] = useState<{x: number, y: number}>();

	return (
		<></>
	);
}