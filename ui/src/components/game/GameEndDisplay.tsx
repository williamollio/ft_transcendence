import { Grid, Typography, Zoom } from "@mui/material";
import { useEffect } from "react";
import { GameState } from "../../interfaces/game.interface";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../views/Game/constants";

interface Props {
  zoom: boolean;
  toggleZoom: React.Dispatch<React.SetStateAction<boolean>>;
  gameState: GameState;
}

export default function GameEndDisplay(props: Props) {
  const { zoom, toggleZoom, gameState } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (zoom) {
      setTimeout(() => toggleZoom(false), 3000);
    }
  }, [zoom]);

  return (
    <Grid container alignItems="center" justifyContent="center" zIndex={10}>
      <Grid item>
        <Zoom in={zoom}>
          {gameState === GameState.WIN ? (
            <Typography fontSize={60}>
              {t(translationKeys.gameEndState.win)}
            </Typography>
          ) : (
            <Typography fontSize={60}>
              {t(translationKeys.gameEndState.loss)}
            </Typography>
          )}
        </Zoom>
      </Grid>
    </Grid>
  );
}
