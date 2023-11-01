import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { publishRoute, privateRoute } from './routes';
import { DefaultLayout } from './layouts';
import ScrollAutoTop from './components/ScrollAutoTop/ScrollAutoTop.ts';

function App() {
    const isSignIn = false;
    return (
        <>
            {(!isSignIn && (
                <Router>
                    <ScrollAutoTop />
                    <div className="App">
                        <Routes>
                            {publishRoute.map((item, index) => {
                                const Layout = item.layout === null ? Fragment : item.layout || DefaultLayout;

                                const Element = item.component;
                                return (
                                    <Route
                                        key={index}
                                        path={item.path}
                                        element={
                                            <Layout>
                                                <Element />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                    </div>
                </Router>
            )) || (
                <Router>
                    <ScrollAutoTop />
                    <div className="App">
                        <Routes>
                            {[...publishRoute, ...privateRoute].map((item, index) => {
                                const Layout = item.layout === null ? Fragment : item.layout || DefaultLayout;

                                const Element = item.component;
                                return (
                                    <Route
                                        key={index}
                                        path={item.path}
                                        element={
                                            <Layout>
                                                <Element />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                    </div>
                </Router>
            )}
        </>
    );
}

export default App;
