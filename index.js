const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cors = require("cors");

const {
    getEventos,
    deleteEvento,
    verificarCredenciales,
    actualizarEvento,
    registrarUsuario,
} = require("./consultas");


app.set("port", process.env.PORT || 4000);
app.listen(app.get("port"), console.log(`Serving on port ${app.get("port")}`));
app.use(cors());
app.use(express.json());

app.get("/eventos", async (req, res) => {
    try {
        const eventos = await getEventos();
        res.json(eventos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, "az_AZ");
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.delete("/eventos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        await deleteEvento(id)
        res.send(`El usuario ${email} ha eliminado el evento ${id} `);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put("/eventos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body
        payload.id = id
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        console.log(payload)
        await actualizarEvento(payload)
        res.status(200).send(`El usuario ${email} a modificado el evento ${id}`)
    } catch (error) {
        res.status(500).send(error)
    }
});

app.post("/usuarios", async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con exito")
    } catch (error) {
        res.status(500).send(error)
    }
})
