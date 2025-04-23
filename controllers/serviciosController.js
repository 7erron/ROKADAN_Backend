const express = require('express');
const router = express.Router();
const { Servicio } = require('../models/Servicio');
const { verificarToken, verificarRol } = require('../middlewares/auth');

// Obtener todos los servicios disponibles (público o autenticado)
router.get('/', async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.json(servicios);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ message: 'Error al obtener servicios.' });
    }
});

// Crear un nuevo servicio (solo administrador)
router.post('/', verificarToken, verificarRol('admin'), async (req, res) => {
    const { nombre, descripcion, precio } = req.body;

    try {
        const nuevoServicio = await Servicio.create({ nombre, descripcion, precio });
        res.status(201).json(nuevoServicio);
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({ message: 'Error al crear servicio.' });
    }
});

// Actualizar un servicio (solo administrador)
router.put('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    try {
        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado.' });
        }

        await servicio.update({ nombre, descripcion, precio });
        res.json(servicio);
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ message: 'Error al actualizar servicio.' });
    }
});

// Eliminar un servicio (solo administrador)
router.delete('/:id', verificarToken, verificarRol('admin'), async (req, res) => {
    const { id } = req.params;

    try {
        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado.' });
        }

        await servicio.destroy();
        res.json({ message: 'Servicio eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({ message: 'Error al eliminar servicio.' });
    }
});

module.exports = router;
