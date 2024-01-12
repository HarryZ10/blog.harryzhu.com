import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/globalStyles';
import theme from './styles/themes';
import Routes from './routes';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes />
    </ThemeProvider>
  );
};

export default App;
