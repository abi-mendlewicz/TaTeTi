// Variables globales
const tableroHTML = Array.from(document.querySelectorAll('#tablero .col'))


// Clase para manejar el array con los elemento HTML que conforman el tablero de juego
class TableroHTML {
  constructor() {
    this.casilleros = Array.from(document.querySelectorAll('#tablero .col'))
    this.casillerosEnLinea = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
  }

  // Obtener indece del casillero en la colección HTML del tablero
  obtenerCasilleroIndex = casillero => this.casilleros.findIndex(_casillero => _casillero === casillero)

  // Obtener casilleros ocupados
  obtenerCasillerosOcupados = () => turnos.map(turno => turno.casillero)

  // Obtener casilleros ocupados por el usuario
  obtenerCasillerosOcupadosUsuario = () => turnos.filter(turno => turno.jugador == 'usuario' && turno.casillero !== false).map(turno => turno.casillero)

  // Obtener casilleros ocupados por el jugador virtual
  obtenerCasillerosOcupadosVirtual = () => turnos.filter(turno => turno.jugador == 'virtual' && turno.casillero !== false).map(turno => turno.casillero)

  // Obtener casilleros libres
  obtenerCasillerosLibres() {
    const casillerosOcupados = this.obtenerCasillerosOcupados()
    const casillerosLibres = []
  
    for (const casillero of this.casilleros.keys()) {
      casillerosOcupados.includes(casillero) || casillerosLibres.push(casillero)
    }
    
    return casillerosLibres
  }

  // Buscar casillero para cerrar el partido y devolver el índice o false
  buscarWinner() {
    const casillerosOcupadosVirtual = this.obtenerCasillerosOcupadosVirtual()
    
    if (casillerosOcupadosVirtual.length > 1) {
      for (const linea of this.casillerosEnLinea) {
        const lineaPromisoria = linea.filter(casillero => casillerosOcupadosVirtual.includes(casillero))

        if (lineaPromisoria.length > 1) {
          const casilleroAOcupar = linea.filter(casillero => !lineaPromisoria.includes(casillero))
          const casillerosOcupados = this.obtenerCasillerosOcupados()
          if (!casillerosOcupados.includes(casilleroAOcupar[0])) {
            return casilleroAOcupar[0]
          }
        }
      }
    }

    return false
  }

  // Analizar el tablero buscando la primera línea con dos fichas del usuario y devolver el casillero libre
  detectarAmenaza() {
    const casillerosOcupadosUsuario = this.obtenerCasillerosOcupadosUsuario()

    for (const linea of this.casillerosEnLinea) {
      const lineaPeligrosa = linea.filter(casillero => casillerosOcupadosUsuario.includes(casillero))

      if (lineaPeligrosa.length > 1) {
        const casilleroAOcupar = linea.filter(casillero => !lineaPeligrosa.includes(casillero))
        const casillerosOcupados = this.obtenerCasillerosOcupados()
        if (!casillerosOcupados.includes(casilleroAOcupar[0])) {
          return casilleroAOcupar[0]
        }
      }
    }

    return false
  }

  // Enlazar evento click en los casilleros para generar las jugadas de usuario
  activarTableroHTML = turno => {
    const casillerosLibres = this.obtenerCasillerosLibres()
    
    casillerosLibres.forEach(casillero => {
      this.casilleros[casillero].addEventListener('click', turno.realizarJugada)
    })
  }

  // Desenlazar evento click en los casilleros para no permitir generar jugadas al usuario
  desactivarTableroHTML = turno => {
    const casillerosLibres = this.obtenerCasillerosLibres()
    
    casillerosLibres.forEach(casillero => {
      this.casilleros[casillero].removeEventListener('click', turno.realizarJugada)
    })
  }
}

// Funciones para el manejo del tablero de juego
// Actualizar jugadas en tablero
const renderTableroHTML = () => {
  const tableroHTML = new TableroHTML()

  tableroHTML.casilleros.forEach((casillero, i) => {
    const casilleroOcupado = turnos.find(turno => turno.casillero === i)
    
    if (casilleroOcupado) {
      casillero.innerHTML = casilleroOcupado.jugador === jugadoresOrdenados[0]
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-circle"></i>'
    } else {
      casillero.innerHTML = ''
    }
  })
}