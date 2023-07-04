import { useCallback, useEffect, useState } from 'react';
import RGBColor from 'rgbcolor';
import { ReactComponent as IconLeftArrow } from './arrow-left.svg';
import { ReactComponent as IconRightArrow } from './arrow-right.svg';
import './App.scss';

const storageKeys = {
  backgroundColor: 'background-color',
  backgroundColorHistory: 'background-color-history',
  backgroundColorRedo: 'background-color-redo',
};

const defaultColor = '#d9d9d9';
const maxHistory = 500;

function App() {
  const [init, setInit] = useState<boolean>(false);
  const [colorHistory, setColorHistory] = useState<string[]>([defaultColor]);
  const [colorRedo, setColorRedo] = useState<string[]>([]);
  const [color, setColor] = useState<string>(defaultColor);

  const { r, g, b } = new RGBColor(color);
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const isLight = y > 128;
  const textColor = isLight ? '#000' : '#fff';

  const handleColorChanged = useCallback((newColor: string) => {
    setColor(newColor);
    if (colorHistory[0] !== newColor) {
      setColorHistory(h => [newColor, ...h].slice(0, maxHistory));
      setColorRedo([]);
    }
  }, [colorHistory]);

  const undoColor = useCallback(() => {
    const newColorHistory = [...colorHistory];
    const oldColor = newColorHistory.shift()!;
    setColorHistory(newColorHistory);
    setColor(newColorHistory[0]);
    setColorRedo(r => [oldColor, ...r].slice(0, maxHistory));
  }, [colorHistory]);

  const redoColor = useCallback(() => {
    const newColorRedo = [...colorRedo];
    const newColor = newColorRedo.shift()!;
    setColorRedo(newColorRedo);
    setColorHistory(h => [newColor, ...h].slice(0, maxHistory));
    setColor(newColor);
  }, [colorRedo]);

  useEffect(() => {
    const storedColor = window.localStorage.getItem(storageKeys.backgroundColor);
    if (storedColor) {
      setColor(storedColor);
    }
    const storedColorHistory = window.localStorage.getItem(storageKeys.backgroundColorHistory);
    if (storedColorHistory) {
      setColorHistory(JSON.parse(storedColorHistory));
    }
    const storedColorRedo = window.localStorage.getItem(storageKeys.backgroundColorRedo);
    if (storedColorRedo) {
      setColorRedo(JSON.parse(storedColorRedo));
    }
    setInit(true);
  }, []);

  useEffect(() => {
    if (!init) {
      return;
    }
    window.localStorage.setItem(storageKeys.backgroundColor, color);
  }, [init, color]);

  useEffect(() => {
    if (!init) {
      return;
    }
    window.localStorage.setItem(storageKeys.backgroundColorHistory, JSON.stringify(colorHistory));
  }, [init, colorHistory]);

  useEffect(() => {
    if (!init) {
      return;
    }
    window.localStorage.setItem(storageKeys.backgroundColorRedo, JSON.stringify(colorRedo));
  }, [init, colorRedo]);

  return (
    <div className="App" style={{ background: color, '--text-color': textColor } as React.CSSProperties}>
      <div className="App-action-bar">
        <div className="App-icon-link" style={{ opacity: colorHistory?.length > 1 ? 1 : 0, pointerEvents: colorHistory?.length > 1 ? 'all' : 'none' }} onClick={undoColor}>
          <IconLeftArrow />
          <span className="App-sub-note">
            <div className="App-swatch" style={{ background: colorHistory[1] }}></div>
            {colorHistory[1]}
          </span>
        </div>
        <label htmlFor="input-color" className="App-link">
          <span className="App-text">{color}</span>
          <input id="input-color" type="color" value={color} onChange={ev => setColor(ev.target.value)} onBlur={ev => handleColorChanged(ev.target.value)} />
        </label>
        <div className="App-icon-link" style={{ opacity: colorRedo?.length > 0 ? 1 : 0, pointerEvents: colorRedo?.length > 0 ? 'all' : 'none' }} onClick={redoColor}>
          <span className="App-sub-note">
            <div className="App-swatch" style={{ background: colorRedo[0] }}></div>
            {colorRedo[0]}
          </span>
          <IconRightArrow />
        </div>
      </div>
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      <a className="App-signature App-link" href="https://rgoupil.com" target="_blank" rel="author noopener">
        made with ❤️ by Robin Goupil
      </a>
    </div>
  );
}

export default App;
