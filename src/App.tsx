import { useEffect, useState } from 'react';
import RGBColor from 'rgbcolor';
import './App.scss';

const storageKeys = {
  backgroundColor: 'background-color',
};

const defaultColor = '#d9d9d9';

function App() {
  const [init, setInit] = useState<boolean>(false);
  const [color, setColor] = useState<string>(defaultColor);

  const { r, g, b } = new RGBColor(color);
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const isLight = y > 128;
  const textColor = isLight ? '#000' : '#fff';

  useEffect(() => {
    const data = window.localStorage.getItem(storageKeys.backgroundColor);
    if (data) {
      setColor(data);
    }
    setInit(true);
  }, []);

  useEffect(() => {
    if (!init) {
      return;
    }
    window.localStorage.setItem(storageKeys.backgroundColor, color);
  }, [init, color]);

  return (
    <div className="App" style={{ background: color }}>
      <label htmlFor="input-color" className="App-link">
        <span className="App-text" style={{ color: textColor }}>{color}</span>
        <input id="input-color" type="color" value={color} onChange={ev => setColor(ev.target.value)} />
      </label>
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      <a className="App-signature App-link" style={{ color: textColor }} href="https://rgoupil.com" target="_blank" rel="author noopener">
        made with ❤️ by Robin Goupil
      </a>
    </div>
  );
}

export default App;
