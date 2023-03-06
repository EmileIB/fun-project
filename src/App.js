import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useMemo,
} from "react";

import {
  questions as initialQuestions,
  members,
  funnyErrorMessages,
} from "./data";

import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";

import {
  Container,
  Box,
  TextField,
  Autocomplete,
  Typography,
  List,
  ListItem,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [questions, setQuestions] = useState(initialQuestions);
  const [currQuestion, setCurrQuestion] = useState(undefined);
  const [solved, setSolved] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setCurrQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }, [questions]);

  const handleSubmit = () => {
    if (currQuestion.answer === answer) {
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== currQuestion.id)
      );
      setSolved((prevSolved) => prevSolved + 1);
      setAnswer("");
      setError(false);
    } else {
      setError(true);
      const prevErrorMessage = errorMessage;
      let currErrorMessage =
        funnyErrorMessages[
          Math.floor(Math.random() * funnyErrorMessages.length)
        ];
      while (currErrorMessage === prevErrorMessage) {
        currErrorMessage =
          funnyErrorMessages[
            Math.floor(Math.random() * funnyErrorMessages.length)
          ];
      }
      setErrorMessage(currErrorMessage);
    }
  };

  return (
    <Container
      maxWidth="none"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {currQuestion && (
          <Box
            sx={{
              minWidth: 500,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h3">Guess Who!</Typography>
              <IconButton
                sx={{ ml: 1 }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
              >
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Proggress: {solved}/{initialQuestions.length}
            </Typography>
            <Typography variant="h5">Hints:</Typography>
            <List dense sx={{ mb: 2 }}>
              {currQuestion.hints.map((hint, index) => (
                <ListItem key={index}>{hint}</ListItem>
              ))}
            </List>

            <Autocomplete
              options={members.sort((a, b) => a.localeCompare(b))}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Team Member"
                  variant="outlined"
                  error={error}
                  helperText={error ? errorMessage : null}
                />
              )}
              onChange={(_event, newValue) => {
                setAnswer(newValue);
              }}
              value={answer ? answer : null}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              Submit <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        )}
        {solved === initialQuestions.length && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" sx={{ mt: 2 }}>
              Congrats! You solved all the questions!
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Play again
            </Button>
          </Box>
        )}
      </Container>
    </Container>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState(
    useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light"
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
