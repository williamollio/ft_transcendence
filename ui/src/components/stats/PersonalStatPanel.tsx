import { Paper, Box, Typography, Grid, Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import SingleStatComponent from "./SingleStatComponent";
import TwoStatsComponent from "./TwoStatsComponen";
import StatsService from "../../services/stats.service";
import { useEffect, useState } from "react";
import { playerStats } from "../../interfaces/stats.interface";
import { makeStyles } from "tss-react/mui";
import classes from "../../styles.module.scss";

interface Props {
  playerId: string;
  lr: boolean;
  title: "General" | "Ranked";
}

export default function PersonalStatPanel(props: Props) {
  const { classes } = useStyles();
  const { lr, title, playerId } = props;

  const { data, isLoading, isError, isRefetching } = useQuery(
    ["personalStats"],
    () => StatsService.fetchPersonalStats(playerId)
  );

  const [playerStats, setPlayerStats] = useState<playerStats>({
    currentRating: 0,
    rank: 0,
    gamesWon: 0,
    gamesLost: 0,
  });

  useEffect(() => {
    if (data && !isLoading && !isError && !isRefetching) {
      const newPlayer: playerStats = {
        currentRating: data.eloScore,
        gamesWon: data.numberOfWin,
        gamesLost: data.numberOfLoss,
        rank: data.ranking,
      };
      setPlayerStats(newPlayer);
    }
  }, [data, isLoading, isError, isRefetching]);

  return (
    <>
      <Box>
        <Paper
          className={classes.colorScheme}
          sx={{
            position: "absolute",
            top: "185px",
            height: "auto",
            width: "20%",
            ...(lr ? { left: "77px" } : { right: "77px" }),
          }}
        >
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
                leftValue={playerStats.currentRating}
                rightValue={playerStats.rank}
              ></TwoStatsComponent>
            </>
          ) : (
            <>
              <TwoStatsComponent
                leftTitle="Games Won"
                rightTitle="Games Lost"
                leftValue={playerStats.gamesWon}
                rightValue={playerStats.gamesLost}
              ></TwoStatsComponent>
              <SingleStatComponent
                title="Total Games"
                value={playerStats.gamesWon + playerStats.gamesLost}
              ></SingleStatComponent>
              <SingleStatComponent
                title="Win %"
                value={
                  (playerStats.gamesWon /
                    (playerStats.gamesWon + playerStats.gamesLost)) *
                  100
                }
                postfix="%"
              ></SingleStatComponent>
              {/* <SingleStatComponent
                bottomBorder={false}
                title="Highest Score"
                value="0"
              ></SingleStatComponent> */}
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}

const useStyles = makeStyles()(() => ({
  colorScheme: {
    backgroundColor: classes.colorPrimary,
    color: classes.colorPrimary,
    WebkitTextFillColor: classes.colorSecondary,
  },
}));
