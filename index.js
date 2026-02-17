require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const contratoABI = require('./utils/abi.json');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN ETHERS ---

// Conexión al nodo (Blockchain)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Configuración de la Wallet (Firmante)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Conexión al Smart Contract
const contrato = new ethers.Contract(process.env.CONTRACT_ADDRESS, contratoABI, wallet);

console.log(`Conectado a la wallet: ${wallet.address}`);

/**
 * 1. POST /mintarAutorizacion
 * Recibe datos del pedido y el CID de IPFS (rutaDatos) para crear el NFT.
 */
app.post('/mintarAutorizacion', async (req, res) => {
    try {
        const {
            destinatario,       // Address del cliente
            personaAutorizada,  // Address del autorizado
            referenciaExterna,  // ID numérico del pedido
            pin,                // Pin de seguridad numérico
            rutaDatos           // URL completa o CID de IPFS
        } = req.body;

        // Validaciones
        if (!destinatario || !rutaDatos) {
            return res.status(400).json({ error: "Faltan datos (destinatario, rutaDatos)" });
        }

        console.log("Iniciando mintado en Blockchain...");

        // Llamada al Smart Contract: registrarPedido
        const tx = await contrato.registrarPedido(
            destinatario,
            personaAutorizada || ethers.ZeroAddress, // Si no hay autorizado, se pone 0x0
            referenciaExterna,
            pin || 0,
            rutaDatos
        );

        console.log(`Transacción enviada: ${tx.hash}. Esperando confirmación...`);

        // Esperamos a que se mine (1 confirmación)
        const recibo = await tx.wait();

        // Buscamos el evento 'NuevoPedidoRegistrado' para saber el ID del Token creado
        res.status(200).json({
            success: true,
            mensaje: "Token mintado correctamente",
            transactionHash: tx.hash,
            bloque: recibo.blockNumber
        });

    } catch (error) {
        console.error("Error al mintar:", error);
        res.status(500).json({ error: "Fallo en transacción Blockchain", detalle: error.message });
    }
});

/**
 * 2. POST /transferirAutorizacion
 * Transfiere el token de una persona a otra.
 * Recibe el ID del token (idToken) y la nueva dirección del destinatario (nuevoDestinatario).
 * IMPORTANTE: El backend debe ser el dueño del token para poder transferirlo. Si no, esta operación fallará.
 */
app.post('/transferirAutorizacion', async (req, res) => {
    try {
        const { idToken, nuevoDestinatario } = req.body;

        if (!idToken || !nuevoDestinatario) {
            return res.status(400).json({ error: "Faltan datos (idToken, nuevoDestinatario)" });
        }

        console.log(`Transfiriendo token ${idToken} a ${nuevoDestinatario}...`);

        const tx = await contrato.transferirPermiso(nuevoDestinatario, idToken);

        await tx.wait();

        res.status(200).json({
            success: true,
            mensaje: "Transferencia realizada",
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error("Error al transferir:", error);
        res.status(500).json({ error: "Fallo al transferir", detalle: error.message });
    }
});

app.listen(port, () => {
    console.log(`Microservicio SmartContract corriendo en http://localhost:${port}`);
});