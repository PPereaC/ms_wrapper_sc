# Microservicio Wrapper Smart Contract (Ethers.js)

Este microservicio actúa como la pasarela entre el Backend y la Blockchain (Ethereum/Sepolia). Utiliza la librería **Ethers.js (v6)** para interactuar con el Smart Contract `GestionEntregas`, permitiendo la creación (mintado) de NFTs de autorización y su posterior transferencia entre cuentas.

## 📋 Requisitos Previos

* **Node.js**: v18 o superior.
* **NPM**: Gestor de paquetes.
* **Wallet**: Una cuenta con fondos en la red de pruebas (Sepolia ETH) para pagar el gas de las transacciones.
* **Proveedor RPC**: URL de conexión a la red (Alchemy, Infura o nodo público).

## 🚀 Instalación

1.  Accede al directorio del microservicio:
    ```bash
    cd ms_wrapper_sc
    ```

2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
    *Las dependencias principales incluyen `express`, `dotenv`, `cors` y `ethers`.*

3.  **Importante**: Asegúrate de que existe la carpeta `utils` con el archivo `abi.json` que contiene la interfaz del contrato inteligente.

## ⚙️ Configuración (.env)

Es obligatorio crear un archivo `.env` en la raíz del proyecto (`ms_wrapper_sc/.env`).

**ADVERTENCIA DE SEGURIDAD**: Nunca subas este archivo a un repositorio público, ya que contiene tu Clave Privada.

```env
# Puerto del servidor (Por defecto 3002)
PORT=3002

# URL del nodo RPC de la red Sepolia
# Recomendado: Usar Alchemy o Infura para mayor estabilidad.
# Ejemplo público: [https://ethereum-sepolia.publicnode.com](https://ethereum-sepolia.publicnode.com)
RPC_URL="[https://eth-sepolia.g.alchemy.com/v2/TU_API_KEY](https://eth-sepolia.g.alchemy.com/v2/TU_API_KEY)"

# Clave Privada de la Wallet "Owner" (La que desplegó el contrato)
# Necesaria para firmar las transacciones de mintado.
PRIVATE_KEY="tu_clave_privada_aqui_sin_comillas"

# Dirección del Smart Contract desplegado en Sepolia
CONTRACT_ADDRESS="0x..."
