const express = require('express');
const router = express.Router();
const Cabana = require('../models/Cabana');
const { auth, restrictToAdmin } = require('../middlewares/auth');

// Rutas públicas
router.get('/destacadas', async (req, res) => {
  try {
    const cabanas = await Cabana.findDestacadas();
    res.json(cabanas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/disponibles', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, adultos, ninos } = req.query;
    const cabanas = await Cabana.findDisponibles(fechaInicio, fechaFin, adultos, ninos);
    res.json(cabanas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas protegidas
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const cabanas = await Cabana.findAll();
    res.json(cabanas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cabana = await Cabana.findById(req.params.id);
    if (!cabana) {
      return res.status(404).json({ error: 'Cabaña no encontrada' });
    }
    res.json(cabana);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas solo para admin
router.use(restrictToAdmin);

router.post('/', async (req, res) => {
  try {
    const nuevaCabana = await Cabana.create(req.body);
    res.status(201).json(nuevaCabana);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const cabanaActualizada = await Cabana.update(req.params.id, req.body);
    res.json(cabanaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Cabana.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;