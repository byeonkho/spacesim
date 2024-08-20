import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark', // This sets the base theme to dark mode
        primary: {
            main: '#0d47a1', // Deep Space Blue
            light: '#5472d3',
            dark: '#002171',
        },
        secondary: {
            main: '#ffab00', // Star Yellow
            light: '#ffdd4b',
            dark: '#c67c00',
        },
        background: {
            default: '#0a1929', // Deeper space blue for default background
            paper: '#1e1e1e', // Slightly lighter than Dark Nebula Gray for contrast
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0bec5', // A more muted secondary text color
        },
        error: {
            main: '#ff1744', // Red Planet Red
        },
        warning: {
            main: '#ff9100', // Comet Orange
        },
        info: {
            main: '#29b6f6', // A brighter Interstellar Blue
        },
        success: {
            main: '#00e676', // Alien Green
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 0 10px rgba(255,255,255,0.5)', // Glow effect
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 0 8px rgba(255,255,255,0.4)', // Glow effect
        },
        body1: {
            fontSize: '1rem',
            color: '#ffffff',
        },
        body2: {
            fontSize: '0.875rem',
            color: '#b0bec5', // Matching the secondary text color
        },
    },
    shape: {
        borderRadius: 8
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #0d47a1 30%, #2196f3 90%)', // Gradient effect
                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #002171 30%, #0d47a1 90%)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(45deg, #ffab00 30%, #ffd740 90%)', // Gradient effect
                    color: '#000000',
                    boxShadow: '0 3px 5px 2px rgba(255, 171, 0, .3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #c67c00 30%, #ffab00 90%)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(13, 71, 161, 0.9)', // Semi-transparent Deep Space Blue
                    backdropFilter: 'blur(10px)', // Glassmorphism effect
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(30, 30, 30, 0.8)', // Semi-transparent Dark Nebula Gray
                    backdropFilter: 'blur(10px)', // Glassmorphism effect
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Semi-transparent Dark Nebula Gray
                    backdropFilter: 'blur(10px)', // Glassmorphism effect
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                        },
                    },
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;