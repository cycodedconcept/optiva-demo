 import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
// import './index.css';
import App from './App.jsx';
import store from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={ store }>
    <App />
  </Provider>
)
