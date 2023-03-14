import { Grid, Typography, Divider } from "@mui/material";

interface Props {
  bottomBorder?: boolean;
  title: string;
  value: number;
  prefix?: string;
  postfix?: string;
}

export default function SingleStatComponent(props: Props) {
  const { bottomBorder, title, value, prefix, postfix } = props;

  return (
    <>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography fontSize={"20px"}>{title}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography fontSize={"26px"}>
            {prefix ? prefix : false}
            {value}
            {postfix ? postfix : false}
          </Typography>
        </Grid>
      </Grid>
      {bottomBorder !== false ? <Divider /> : false}
    </>
  );
}
