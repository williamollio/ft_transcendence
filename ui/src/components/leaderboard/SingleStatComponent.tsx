import { Grid, Typography, Divider } from "@mui/material";

interface Props {
  bottomBorder?: boolean;
  title: string;
  value: string;

}

export default function SingleStatComponent(props: Props) {
  const { bottomBorder, title, value } = props;

  return (
    <>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography fontSize={"20px"}>{title}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography fontSize={"26px"}>{value}</Typography>
        </Grid>
      </Grid>
      {bottomBorder !== false ? <Divider /> : false}
    </>
  );
}
