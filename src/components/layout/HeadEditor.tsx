import { Avatar, Button, Grid, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import LockIcon from "@material-ui/icons/Lock";
import React, { useState } from "react";
import { iconFile, starBorderIcon, startIconYellow } from "../utils/Icons";

const HeadEditor = () => {
  const [start, setStart] = useState<boolean>(false);
  const handleStart = () => {
    setStart(!start);
  };

  return (
    <>
      <Grid container spacing={1} alignItems="center">
        <Grid
          item
          style={{
            backgroundColor: "black",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            padding: 0
          }}
        >
          <Grid
            item
            md={4}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px"
            }}
          >
            <IconButton
              color={"inherit"}
              aria-label="volver atras"
              component="span"
            >
              {iconFile}
            </IconButton>
            <TextField id="standard-basic" label="Untitled document" />
            <IconButton
              color={"inherit"}
              aria-label="volver atras"
              component="span"
              onClick={handleStart}
            >
              {!start ? starBorderIcon : startIconYellow}
            </IconButton>
          </Grid>

          <Grid
            item
            md={12}
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              display: "flex",
              marginRight: "20px",
              alignItems: "center"
            }}
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LockIcon />}
              >
                Share
              </Button>
            </Grid>
            <Grid
              item
              style={{
                marginLeft: "10px"
              }}
            >
              <Avatar alt="Remy Sharp" src="/images/DarthVader.jpg" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default HeadEditor;
