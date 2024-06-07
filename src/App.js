import logo from './logo.svg';
import './App.css';
import QrReader from './components/QrReader';
import QrScanners from './components/QrScanner';

function App() {
  return (
    <div className="App">
      <QrReader />
      {/* < QrScanners /> */}
    </div>
  );
}

export default App;
