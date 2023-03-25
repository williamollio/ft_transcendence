import * as jspb from "protobufjs";

export class GameInfo extends jspb.Message<GameInfo> {
  message = jspb.load("./src/classes/file.proto", (err, root) => {


	const tmp = root?.lookupType("userpackage.GameInfo");

	console.log()

	
//   public getP1y(): number;
//   public setP1y(value: number): void;

  //  ... (do more setters and getters here for all the objects of the mssg)

  
//   toObject(includeInstance?: boolean): GameInfo.AsObject;
  //   leave those static functions here to me i m working on them
})}

export namespace GameInfo {
  export type AsObject = {
    p1y: number;
    p2y: number;
    // ...
  };
}
