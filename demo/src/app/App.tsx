import './App.scss';
import { toArrayPropertyIndexedName } from 'react-hook-form-controlled';

export function App() {
    const name = toArrayPropertyIndexedName('array', 10, 'name');
    return <div className="app">Loading...{name}</div>;
}
