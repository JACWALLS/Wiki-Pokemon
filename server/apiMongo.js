const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ========== CONEXIÓN ==========
async function conectarDB() {
  try {
    console.log("Conectando a MongoDB...");
    
    await mongoose.connect("mongodb://ca424837:uaeh0201@ac-ullrqjb-shard-00-00.sykmx8q.mongodb.net:27017,ac-ullrqjb-shard-00-01.sykmx8q.mongodb.net:27017,ac-ullrqjb-shard-00-02.sykmx8q.mongodb.net:27017/?ssl=true&replicaSet=atlas-4rxcrb-shard-0&authSource=admin&appName=Cluster0");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

conectarDB();

// ========== MODELO ==========
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, default: '' }
}, { timestamps: true });

const Producto = mongoose.model('Producto', productoSchema);

// ========== ENDPOINTS ==========
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find({});
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    const nuevoProducto = new Producto({ nombre, precio, descripcion });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    const productoActualizado = await Producto.findByIdAndUpdate(
      id, 
      { nombre, precio, descripcion }, 
      { new: true, runValidators: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});