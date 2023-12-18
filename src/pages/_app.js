import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CssBaseline } from "@mui/material";
import { AuthConsumer, AuthProvider } from "src/auth/authContext";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import Loader from "src/components/Loader";
import "src/components/Signature/signature.css";

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { emotionCache = clientSideEmotionCache, Component, pageProps } = props;
  const theme = createTheme();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Brow Lodge</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthConsumer>
              {(auth) =>
                auth.isLoading ? (
                  <Loader />
                ) : (
                  getLayout(<Component {...pageProps} />)
                )
              }
            </AuthConsumer>
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
