import { Server, Socket } from "net";


function connectionListener() {
    console.log("New connection on socket")
}


/**
 *
 *
 * @author Drazi Crendraven
 * @param {boolean} hadError
 */
function socketCloseListener(hadError) {
    console.log(`Socket closed, error: ${String(hadError)}`)
}


/**
 *
 *
 * @author Drazi Crendraven
 * @param {Error} err
 */
function socketErrorHandler(err) {
    console.error(`Error on socket: ${err.message}`)
}

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Socket} socket
 */
function sockerListener(socket) {
    socket.on("connect", connectionListener)
    socket.on("close", socketCloseListener)

    
    /** @type {Buffer} */
    let dataBuffer = Buffer.alloc(0)

    socket.on("data", (dataChunk => {
        console.log(`Recieved ${dataChunk.byteLength} bytes of data from ${socket.remoteAddress}`)
        console.log(`Data chunk as hex: ${dataChunk.toString("hex")}`)
        dataBuffer = Buffer.concat([dataBuffer, dataChunk])

        // We could be getting data without a connection, such as a UDP packet
        // https://www.ietf.org/rfc/rfc9293.html
    }))

    socket.on("end", () => {console.log(`Data packet as hex: ${dataBuffer.toString("hex")}`)})

    socket.on("error", socketErrorHandler)
}


/**
 *
 *
 * @author Drazi Crendraven
 * @param {Error} err
 */
function connectionErrorHandler(err) {
    console.error(`Error on connection: ${err.message}`)
}

const server = new Server(sockerListener)

server.on("error", connectionErrorHandler)

server.listen(443, "0.0.0.0", () => {
    
    /** @type {import("net").AddressInfo | null | string} */
    const address = server.address()

    if (address !== null && typeof address !== "string" && typeof address.port === "number") {
        console.log(`Server is listening on port ${address.port}`)
        return
    }

})
