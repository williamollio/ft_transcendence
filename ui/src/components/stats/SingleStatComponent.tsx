import { Grid, Typography, Divider } from "@mui/material";
import classes from "../../styles.module.scss";

interface Props {
  bottomBorder?: boolean;
  title: string;
  value: number;
  prefix?: string;
  postfix?: string;
}

export default function SingleStatComponent(props: Props) {
  const { bottomBorder, title, value, prefix, postfix } = props;

  const displayValue = isNaN(value) ? 0 : value;

  return (
    <>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography fontWeight="bold" color="white" fontSize={"20px"}>
            {title}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography color={classes.colorAccent} fontSize={"26px"}>
            {prefix ? prefix : false}
            {displayValue}
            {postfix ? postfix : false}
          </Typography>
        </Grid>
      </Grid>
      {bottomBorder !== false ? <Divider /> : false}
    </>
  );
}
