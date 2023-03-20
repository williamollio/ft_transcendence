import { Paper } from "@mui/material";
import { motion } from "framer-motion";
import { makeStyles } from "tss-react/mui";

interface Props {
  yPos: number;
  lr: boolean;
  posRef: { offsetLeft: number; offsetTop: number };
}

export default function Player(props: Props) {
  const { yPos, lr, posRef } = props;
  const { classes } = useStyles(props);

  return (
    <motion.div animate={{ y: yPos }} className={classes.player}>
      {posRef.offsetLeft !== 0 && posRef.offsetTop != 0 ? (
        <Paper
          elevation={5}
          sx={{
            ...(!props.lr
              ? {
                  backgroundColor: "black",
                }
              : false),
            width: "20px",
            height: "100px",
          }}
        />
      ) : (
        false
      )}
    </motion.div>
  );
}

const useStyles = makeStyles<Props>()((_theme, props) => ({
  player: {
    position: "absolute",
    top: props.yPos,
    ...(props.lr
      ? { left: 10 + props.posRef.offsetLeft }
      : { left: 570 + props.posRef.offsetLeft }),
  },
}));
