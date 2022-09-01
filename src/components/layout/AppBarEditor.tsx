import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import CustomEditor from "../tinymce/CustomEditor";
import HeadEditor from "./HeadEditor";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const AppBarEditor = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              TinyMCE "Google docs clone"
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div>
        <HeadEditor />
        <CustomEditor />
      </div>
    </div>
  );
};

export default AppBarEditor;
