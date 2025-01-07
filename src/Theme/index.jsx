import { createTheme } from "@mui/material/styles";
import { fontFamily, textSizes, themeColorsList } from "../constants";

export const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      fontFamily: fontFamily.lexendMedium,
      fontSize: textSizes.small.value?.primary,
      title1 : {
        fontFamily: fontFamily,
        fontSize: textSizes.large?.value?.primary,
        fontWeight: 400,
      },
      text1 : {
        fontFamily: fontFamily,
        fontSize: textSizes.small?.value?.secondary,
        fontWeight: 400,  
      },
      highLightedText: {
        fontFamily: fontFamily,
        color: "rgb(51, 188, 126)",
        fontWeight: 700,
      },
      iconText: {
        fontSize: textSizes.small?.value?.primary,
        fontFamily: fontFamily,
        fontWeight: 400,
        display: "flex",
        gap: "11px",
        alignItems: "center",
        "svg" : {
          fontSize : textSizes.small?.value?.icons
        }
      },
    },
    components: {
      MuiLink  : {
        styleOverrides : {
          cursor : "pointer !important"
        }
      },
      MuiIcon: {
        styleOverrides: {
          fontSize : `${textSizes.small?.value?.icons} !important`,
          '&.disabled': {
            color : "#00000050 !important"
          },
          "&.dark": {
            color: "#00000090",
          },
        },
      },
      MuiList: {
        styleOverrides: {
          paddingLeft: "20px !important",
          paddingRight: "20px !important",
          paddingTop: "10px !important",
          paddingBottom: "0px !important",
        },
      },
      MuiListItemText : {
        styleOverrides : {
          fontSize : `${textSizes.small?.value?.primary} !important`
        }
      },
      MuiButton : {
        styleOverrides : {
            root : {
                "&.MuiButton-contained" : {
                    color : "#fff"
                }
            }
        }
      },
      MuiTypography : {
        styleOverrides : {
          root: {
            '&.disabled': {
              color : "#00000050 !important"
            },
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: "rgb(240, 239, 239)",
            margin: "3px",
            borderRadius: "6px !important",
            width: "100%",
            "& .MuiOutlinedInput-notchedOutline": {
              display: "none",
            },
          },
          input: {
            fontSize: `${textSizes.small?.value?.secondary} !important`,
            border: "none",
            outline: "none",
            background: "none",
            padding: "10px !important",
            "&::placeholder": {
              color: "gray", // Example placeholder color
            },
          },
        },
      },
    },
    palette: {
      primary: {
        main: themeColorsList.teal?.value?.primary,
      },
      secondary: {
        main: themeColorsList.teal?.value?.secondary,
      },
      custom: {
        lightgray: "#f7f7f7",
      },
    },
  });
