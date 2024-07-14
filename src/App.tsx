import React from 'react';
import TaxGraph from "./components/TaxGraph";
import './App.css';

function App() {
    return (
        <div className={'app-container'}>
            <h1 style={{color: "#691f74", textAlign: "center"}}>Yearly Tax Graph</h1>
            <TaxGraph/>
        </div>
    );
}

export default App;
