import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${props => props.theme.dark.colors.background};
    color: ${props => props.theme.dark.colors.text};
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  input:focus, select:focus, textarea:focus, button:focus {
      outline: none !important;
      outline-width: 0 !important;
      box-shadow: none !important;
      -moz-box-shadow: none !important;
      -webkit-box-shadow: none !important;
  }
`;

export default GlobalStyle;
