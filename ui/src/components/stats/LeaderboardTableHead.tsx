import { TableHead, TableRow, TableCell } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import classes from "../../styles.module.scss";
import { translationKeys } from "../../views/Stats/constants";
import { useTranslation } from "react-i18next";

export default function LeaderboardTableHead() {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow className={classes.tableHead}>
        <TableCell align="left">{t(translationKeys.rank)}</TableCell>
        <TableCell align="center">{t(translationKeys.player)}</TableCell>
        <TableCell align="center">{t(translationKeys.rating)}</TableCell>
        {/* <TableCell align="center">{t(translationKeys.winLoss)}</TableCell> */}
        <TableCell align="center" sx={{ width: "90px" }}>
          {t(translationKeys.history)}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles()(() => ({
  tableHead: {
    "& .MuiTableCell-head": {
      backgroundColor: classes.colorPrimary,
      color: classes.colorPrimary,
      WebkitTextFillColor: classes.colorSecondary,
    },
  },
}));
