import { Grid, Typography, Divider } from "@mui/material";

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
          <Typography>{leftTitle}</Typography>
        </Grid>
        <Grid item>
          <Typography>{rightTitle}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography fontSize={"24px"}>{leftValue}</Typography>
        </Grid>
        <Grid item>
          <Typography fontSize={"24px"}>{rightValue}</Typography>
        </Grid>
      </Grid>
      {bottomBorder !== false ? <Divider /> : false}
    </>
  );
}
