import { Grid, Typography, Divider } from "@mui/material";
import classNames from "classnames";
import classes from "../../styles.module.scss";

interface Props {
  bottomBorder?: boolean;
  leftTitle: string;
  rightTitle: string;
  leftValue: number;
  rightValue: number;
}

export default function TwoStatsComponent(props: Props) {
  const { bottomBorder, leftTitle, rightTitle, leftValue, rightValue } = props;

  return (
    <>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography fontWeight="bold" color="white">{leftTitle}</Typography>
        </Grid>
        <Grid item>
          <Typography fontWeight="bold" color="white">{rightTitle}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography color={classes.colorAccent} fontSize={"24px"}>{leftValue}</Typography>
        </Grid>
        <Grid item>
          <Typography color={classes.colorAccent} fontSize={"24px"}>{rightValue}</Typography>
        </Grid>
      </Grid>
      {bottomBorder !== false ? <Divider /> : false}
    </>
  );
}
