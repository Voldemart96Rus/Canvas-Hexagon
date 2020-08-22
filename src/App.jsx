import React, {useState, useEffect} from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

import Hexagon from './components/Hexagon';
import Footer from './components/Footer';
import useHexagon from './hooks/useHexagon';
import {
    L_INITIAL_VALUE,
    M_INITIAL_VALUE,
    N_INITIAL_VALUE,
    ALERT_TIMEOUT,
} from './constants';
import './App.css';

const App = () => {
    const [sizes, setSizes] = useState({
        L: L_INITIAL_VALUE,
        M: M_INITIAL_VALUE,
        N: N_INITIAL_VALUE,
    });
    const [isAlert, setIsAlert] = useState(false);
    const [alertTimeoutId, setAlertTimeoutId] = useState(null);
    const {hexagon, updateDomains, clearGrid} = useHexagon(sizes);

    useEffect(() => {
        return () => {
            if (alertTimeoutId !== null) clearTimeout(alertTimeoutId);
        };
    }, [alertTimeoutId]);

    const showAlert = () => {
        setIsAlert(true);
        setAlertTimeoutId(setTimeout(() => setIsAlert(false), ALERT_TIMEOUT));
    };

    const onHexagonClick = (e) => {
        const currentHex = hexagon.map.get(e.target.id);
        updateDomains(currentHex);
    };

    return (
        <>
            <main className="App">
                <Container>
                    <div className="wrap">
                        <div onClick={onHexagonClick}>
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
                hexagon={hexagon}
                updateDomains={updateDomains}
                clearGrid={clearGrid}
                showAlert={showAlert}
                onSizesChange={(sizes) => setSizes(sizes)}
            />
            {isAlert && (
                <Alert className="alert" variant="info">
                    Статистика обновлена.
                </Alert>
            )}
        </>
    );
};

export default App;
