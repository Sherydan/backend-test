const e = require("express");
const { Pool } = require("pg");
const bcrypt = require('bcryptjs')


const pool = new Pool({
    host: "containers-us-west-123.railway.app",
    user: "postgres",
    password: "yq6qd5p1YY9SkGUfOIaU",
    database: "railway",
    allowExitOnIdle: true,
    port: 7431
});

const getEventos = async () => {
    const { rows: eventos } = await pool.query("SELECT * FROM eventos");
    return eventos;
};

const deleteEvento = async (id) => {
    const consulta = "DELETE FROM eventos WHERE id = $1";
    const values = [id];
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount)
        throw {
            code: 404,
            message: "No se encontró ningún evento con este ID",
        };
};

const verificarCredenciales = async (email, password) => {
   const values = [email]
   const consulta = "SELECT * FROM usuarios WHERE email = $1"

   const { rows: [usuario], rowCount } = await pool.query(consulta, values)

   const {password: passwordEncriptada} = usuario
   const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)

   if(!passwordEsCorrecta || !rowCount) throw { code: 401, message: "Email o contraseña incorrecta"}
};

const actualizarEvento = async ({ titulo, descripcion, fecha, lugar, id }) => {
    try {
        const consulta =
            "UPDATE eventos SET titulo = $1, descripcion = $2, fecha = $3, lugar = $4 WHERE id = $5";
        const values = [titulo, descripcion, fecha, lugar, id];
        const { rowCount } = await pool.query(consulta, values);
        console.log(rowCount);
    } catch (error) {
        console.log(error);
    }
};

const registrarUsuario = async (usuario) => {
    try {
        let { email, password } = usuario;
        const passwordEncriptada = bcrypt.hashSync(password);
        password = passwordEncriptada;
        const values = [email, passwordEncriptada];
        const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2)";
        await pool.query(consulta, values);
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    getEventos,
    deleteEvento,
    verificarCredenciales,
    actualizarEvento,
    registrarUsuario,
};
