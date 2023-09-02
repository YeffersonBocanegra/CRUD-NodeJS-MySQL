import express from 'express';
import {pool} from './db.js';

const  app = express()

app.use(express.json());

//Mostrar
app.get('/api/bandas', async (req,res)=> {
    try {
        const [resultado] = await pool.query(
            'SELECT * FROM bandas AS result',
        );
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener bandas:', error);
        res.status(500).json({ error: 'No se pudo obtener bandas' });
    }       
});

//Mostrar una Banda
app.get('/api/banda/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bandas WHERE id = ?', [req.params.id]);
        if (rows.length <= 0) return res.status(404).json({message: 'El Id no Existe'});
        res.json(rows); 
    } catch (error) {
        console.error('Error al obtener información de la banda:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener la información de la banda.' });
    }
});


//Insertar
app.post('/api/insertar/bandas', async (req, res) => {
    const { nombre, genero, pais, foto } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO bandas (nombre, genero, pais, foto) VALUES (?, ?, ?, ?)',
            [nombre, genero, pais, foto]
        );
        res.json({ message: 'Banda Insertada correctamente'});
    } catch (error) {
        console.error('Error al insertar la banda:', error);
        res.status(500).json({ error: 'No se pudo insertar la banda' });
    }
});

//Actualizar
app.put('/api/actualizar/bandas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, genero, pais, foto } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE bandas SET nombre = ?, genero = ?, pais = ?, foto = ? WHERE id = ?',
            [nombre, genero, pais, foto, id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'El ID no existe' });
        } else {
            res.json({ message: 'Banda actualizada exitosamente' });
        }
    } catch (error) {
        console.error('Error al actualizar la banda:', error);
        res.status(500).json({ error: 'No se pudo actualizar la banda' });
    }
});



//Borar
app.delete('/api/eliminar/bandas/:id', async (req, res) => {    
    const [result] = await pool.query('DELETE FROM bandas WHERE id = ?', [req.params.id]);

    if (result.affectedRows <= 0) return res.status(404).json({ message: 'No existe Id'});

    res.send('Banda Eliminada Exitosamente')
});


app.listen(3000);
console.log('Server Ejecutandoce en el Puerto => 3000');