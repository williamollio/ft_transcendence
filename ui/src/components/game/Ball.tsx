import { Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { makeStyles } from "tss-react/mui";
import { ballPosition } from "../../interfaces/game.interface";

interface Props {
  ballStart: ballPosition;
  ballPos: ballPosition;
  posRef: { offsetLeft: number; offsetTop: number };
}

export default function Ball(props: Props) {
  const { posRef, ballPos } = props;
  const { classes } = useStyles(props);

  return (
    <>
      {posRef.offsetLeft !== 0 && posRef.offsetTop != 0 ? (
        <motion.div
          animate={{ y: ballPos.y, x: ballPos.x }}
          className={classes.ball}
        >
          <Avatar
            src=""
            sx={{
              boxShadow: 5,
              width: 30,
              height: 30,
            }}
          />
        </motion.div>
      ) : (
        false
      )}
    </>
  );
}

const useStyles = makeStyles<Props>()((_theme, props) => ({
  ball: {
    position: "absolute",
    left: props.posRef.offsetLeft + props.ballStart.x,
    top: props.posRef.offsetTop + props.ballStart.y,
  },
}));
