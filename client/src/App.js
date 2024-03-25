import './App.css';
import Versus from './components/versus';
import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {


  return (
    <Router>
      <Route path="/">
        <Versus/>
      </Route>
    </Router>
  );
}

export default App;
