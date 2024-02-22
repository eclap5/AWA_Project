import { createTheme } from "@mui/material"

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white"
                    }
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&.Mui-checked": {
                        color: "white"
                    }
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&.Mui-focused": {
                        color: "white"
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&.Mui-focused": {
                        color: "white"
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&.Mui-focused": {
                        color: "white"
                    }
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: "white",
                        color: "black"
                    }
                }
            }
        }
    }
})

export default theme