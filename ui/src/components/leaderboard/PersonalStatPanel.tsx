import { Paper, Box, Typography, Grid, Divider } from "@mui/material";
import SingleStatComponent from "./SingleStatComponent";
import TwoStatsComponent from "./TwoStatsComponen";

interface Props {
  lr: boolean;
  title: "General" | "Ranked";
}

export default function PersonalStatPanel(props: Props) {
  const { lr, title } = props;

  return (
    <>
      <Paper
        sx={{
          position: "absolute",
          top: "185px",
          height: "auto",
          width: "20%",
          ...(lr ? { left: "77px" } : { right: "77px" }),
        }}
      >
        <Box>
          <Grid
            direction={"column"}
            container
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Grid item>
              <Typography variant="h4">{title}</Typography>
            </Grid>
          </Grid>
          <Divider />
          {title === "Ranked" ? (
            <>
              {/* <SingleStatComponent
                title="Highest Rating"
                value="0"
			></SingleStatComponent> */}
              <TwoStatsComponent
                bottomBorder={false}
                leftTitle="Current Rating"
                rightTitle="Leaderboard Rank"
                leftValue="0"
                rightValue="#0"
              ></TwoStatsComponent>
            </>
          ) : (
            <>
              <TwoStatsComponent
                leftTitle="Games Won"
                rightTitle="Games Lost"
                leftValue="0"
                rightValue="0"
              ></TwoStatsComponent>
              <SingleStatComponent
                title="Total Games"
                value="0"
              ></SingleStatComponent>
              <SingleStatComponent
                title="Win %"
                value="0%"
              ></SingleStatComponent>
              <SingleStatComponent
                bottomBorder={false}
                title="Highest Score"
                value="0"
              ></SingleStatComponent>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
}
