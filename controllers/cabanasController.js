import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import CabanaCard from "../components/CabanaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function Home() {
    const [destacados, setDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // Datos mock para cuando el backend no responda (eliminar cuando el backend funcione)
    const mockDestacados = [
        {
            id: 1,
            nombre: "Cabaña Deluxe",
            descripcion: "Cabaña premium con vista al lago",
            precio: 150,
            capacidad: 4,
            imagen: "https://www.complejoturisticopucon.com/wp-content/uploads/SeoGoogle_.jpg"
        },
        {
            id: 2,
            nombre: "Cabaña Familiar",
            descripcion: "Amplia cabaña para toda la familia",
            precio: 200,
            capacidad: 6,
            imagen: "https://www.complejoturisticopucon.com/wp-content/uploads/SeoGoogle_.jpg"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://rokadan-backend.onrender.com/api/cabanas/destacadas');
                const data = response.data.data || [];
                setDestacados(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching featured cabins:", err);
                setDestacados([]); // Asegurar que siempre sea un array
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearchRooms = async (searchData) => {
        const { checkin, checkout, adults, children } = searchData;
        setLoading(true);
        setSearchPerformed(true);
        setSearchError(null);

        try {
            const response = await axios.get('https://rokadan-backend.onrender.com/api/cabanas/disponibles', {
                params: {
                    fechaInicio: checkin,
                    fechaFin: checkout,
                    adultos: adults,
                    ninos: children
                }
            });

            const data = response.data.data || [];
            setAvailableRooms(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error searching rooms:", error);
            setSearchError("Error al buscar cabañas disponibles. Por favor, intente nuevamente.");
            setAvailableRooms([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Header onSearch={handleSearchRooms} />
            <div className="container my-5">
                {searchPerformed ? (
                    <>
                        <h2 className="text-success text-center mb-4">
                            {availableRooms.length > 0 ? 
                                "Cabañas Disponibles" : 
                                "No se encontraron cabañas disponibles"}
                        </h2>

                        {searchError && (
                            <div className="alert alert-danger text-center">
                                {searchError}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                {availableRooms.map((room) => (
                                    <div className="col-md-4 mb-4" key={room.id}>
                                        <CabanaCard 
                                            id={room.id}
                                            nombre={room.nombre}
                                            descripcion={room.descripcion}
                                            precio={room.precio}
                                            capacidad={room.capacidad}
                                            imagen={room.imagen}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-4">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSearchPerformed(false);
                                    setAvailableRooms([]);
                                }}
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="row mb-5">
                            <div className="col-md-12 text-center">
                                <h1 className="text-success">BIENVENIDOS A CABAÑAS ROKADAN</h1>
                                <p className="lead">
                                    El lugar perfecto para descansar y disfrutar de la naturaleza
                                </p>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-md-6">
                                <h2>Sobre Nosotros</h2>
                                <p>
                                    En el corazón de la naturaleza, donde el tiempo se detiene y la
                                    tranquilidad reina, se encuentra nuestro refugio: un conjunto de
                                    cabañas diseñadas para ofrecerte una experiencia inolvidable.
                                </p>
                                <Link to="/quienessomos" className="btn btn-outline-success">
                                    Conocer más
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <img
                                    src="https://www.complejoturisticopucon.com/wp-content/uploads/SeoGoogle_.jpg"
                                    alt="Cabañas Rokadan"
                                    className="img-fluid rounded"
                                />
                            </div>
                        </div>

                        <hr className="my-5" />

                        <div className="row">
                            <div className="col-md-12 text-center mb-4">
                                <h2>Cabañas Destacadas</h2>
                            </div>
                        </div>

                        {loading ? (
                            <LoadingSpinner message="Cargando cabañas destacadas..." />
                        ) : (
                            <div className="row">
                            {destacados.map((cabana) => (
                                <div className="col-md-6 mb-4" key={cabana.id}>
                                        <div className="card h-100">
                                            <img
                                                src={cabana.imagen}
                                                className="card-img-top"
                                                alt={cabana.nombre}
                                                style={{ height: "350px", objectFit: "cover" }}
                                            />
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{cabana.nombre}</h5>
                                                <p className="card-text">{cabana.descripcion}</p>
                                                <Link
                                                    to={`/cabanas/${cabana.id}`}
                                                    className="btn btn-success"
                                                >
                                                    Ver detalles
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}

                        <div className="row mt-4 text-center">
                            <div className="col-md-12">
                                <Link to="/cabanas" className="btn btn-primary">
                                    Ver todas las cabañas
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Home;
