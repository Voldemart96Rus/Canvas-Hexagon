import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

import Hexagon from './components/Hexagon';
import Footer from './components/Footer';
import useHexagon from './hooks/useHexagon';
import {L_INITIAL_VALUE, M_INITIAL_VALUE, N_INITIAL_VALUE} from './constants';
import './App.css';

const App = () => {
    const [sizes, setSizes] = useState({
        L: L_INITIAL_VALUE,
        M: M_INITIAL_VALUE,
        N: N_INITIAL_VALUE,
    });
    const [probability, setProbability] = useState(0);
    const {hexagon, updateDomains} = useHexagon(sizes);

    const onClick = (e) => {
        const currentHex = hexagon.map.get(e.target.id);
        updateDomains(currentHex);
    };

    return (
        <>
            <main className="App">
                <Container>
                    <div className="wrap">
                        <div onClick={onClick}>
                            {hexagon.settings.map((settings) => (
                                <Hexagon
                                    key={`${settings.x}:${settings.y}`}
                                    settings={settings}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </main>
            <Footer
                onSizesChange={(sizes) => setSizes(sizes)}
                onProbabilityChange={(p) => setProbability(p)}
            />
        </>
    );
};

export default App;
