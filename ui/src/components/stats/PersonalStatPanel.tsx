import { Paper, Box, Typography, Grid, Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import SingleStatComponent from "./SingleStatComponent";
import TwoStatsComponent from "./TwoStatsComponen";
import StatsService from "../../services/stats.service";
import { useEffect, useState } from "react";
import { playerStats } from "../../interfaces/stats.interface";
import { makeStyles } from "tss-react/mui";
import classes from "../../styles.module.scss";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../views/Stats/constants";

interface Props {
  playerId: string;
  lr: boolean;
  type: "General" | "Ranked";
  title: string;
}

export default function PersonalStatPanel(props: Props) {
  const { classes } = useStyles();
  const { lr, title, playerId, type } = props;
  const { t } = useTranslation();

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
			position: "relative",
            height: "auto",
            width: 300,
            ...(!lr ? { left: "77px" } : { right: "77px" }),
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
          {type === "Ranked" ? (
            <>
              <TwoStatsComponent
                bottomBorder={false}
                leftTitle={t(translationKeys.currRating)}
                rightTitle={t(translationKeys.leaderboardRank)}
                leftValue={playerStats.currentRating}
                rightValue={playerStats.rank}
              ></TwoStatsComponent>
            </>
          ) : (
            <>
              <TwoStatsComponent
                leftTitle={t(translationKeys.gamesWon)}
                rightTitle={t(translationKeys.gamesLost)}
                leftValue={playerStats.gamesWon}
                rightValue={playerStats.gamesLost}
              ></TwoStatsComponent>
              <SingleStatComponent
                title={t(translationKeys.totalGames)}
                value={playerStats.gamesWon + playerStats.gamesLost}
              ></SingleStatComponent>
              <SingleStatComponent
                title={t(translationKeys.winPerc)}
                value={
                  ((playerStats.gamesWon /
                    (playerStats.gamesWon + playerStats.gamesLost)) *
                  100).toPrecision(3)
                }
                postfix="%"
              ></SingleStatComponent>
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
