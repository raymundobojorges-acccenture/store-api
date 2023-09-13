// Importa las dependencias necesarias
const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Define las rutas para productos

//Método GET para obtener todas las categorias
app.get('/categorias', (req, res) => {
  db.query('SELECT * FROM categorias', (error, results) => {
    if (error) {
      console.error('Error al obtener categorias:', error);
      res.status(500).json({ error: 'Hubo un error al obtener las categorias.' });
    } else {
      res.json(results);
    }
  });
});

// Método GET para obtener todos los productos con el nombre de la categoría
app.get('/productos', (req, res) => {
    db.query('SELECT productos.*, categorias.nombre AS nombre_categoria FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id', (error, results) => {
      if (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
      } else {
        res.json(results);
      }
    });
  });

// Método POST para crear un nuevo producto
app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio, id_categoria } = req.body;
  const nuevoProducto = {
    nombre,
    descripcion,
    precio,
    id_categoria,
  };

  db.query('INSERT INTO productos SET ?', nuevoProducto, (error, result) => {
    if (error) {
      console.error('Error al crear un producto:', error);
      res.status(500).json({ error: 'Hubo un error al crear el producto.' });
    } else {
      res.json({ message: 'Producto creado exitosamente', id: result.insertId });
    }
  });
});

// Método PUT para actualizar un producto
app.put('/productos/:id', (req, res) => {
  const { nombre, descripcion, precio, id_categoria } = req.body;
  const idProducto = req.params.id;
  const productoActualizado = {
    nombre,
    descripcion,
    precio,
    id_categoria,
  };

  db.query('UPDATE productos SET ? WHERE id = ?', [productoActualizado, idProducto], (error, result) => {
    if (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Hubo un error al actualizar el producto.' });
    } else {
      res.json({ message: 'Producto actualizado exitosamente' });
    }
  });
});

// Método DELETE para eliminar un producto
app.delete('/productos/:id', (req, res) => {
  const idProducto = req.params.id;

  db.query('DELETE FROM productos WHERE id = ?', idProducto, (error) => {
    if (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Hubo un error al eliminar el producto.' });
    } else {
      res.json({ message: 'Producto eliminado exitosamente' });
    }
  });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});