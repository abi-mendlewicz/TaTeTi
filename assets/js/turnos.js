// Variables globales
const turnos = []
const turnosEstablecidos = []

// Clase para manejar los objetos Turno
class Turno {
  constructor(jugador, casillero) {
    this.jugador = jugador || this.obtenerJugadorTurno()
    this.casillero = casillero || null
  }

  // Asignar y devolver jugador para el nuevo turno
  obtenerJugadorTurno() {
    return jugadoresActivos.usuario.inicia != turnos.length % 2 ? 'usuario' : 'virtual'
  }

  // Decretar al ganador
  decretarGanador() {
    const notificado = new Notificado({
      titulo: this.jugador == 'usuario' ? 'Felicitaciones...' : 'Lo siento...',
      mensaje: this.jugador == 'usuario' ? 'Ganaste!' : 'A veces toca perder pero el Tres en línea siempre da revancha!',
      icono:  this.jugador == 'usuario' ? '<i class="bi bi-trophy"></i>' : '<i class="bi bi-award"></i>',
      fondo: this.jugador == 'usuario' ? './assets/imagenes/fuegos-artificiales.webp' : './assets/imagenes/lluvia.webp',
    })
    
    notificado.mostrar()
    jugadoresActivos[this.jugador].actualizarEstadisticas(this.jugador)
    habilitarCambioDeTurnos()
    activarCambioDeOponente()
    renderBotonPartida('nueva', 'Volver a jugar')
  }

  // Decretar empate
  decretarEmpate() {
    const notificado = new Notificado({
      titulo: 'Bien...',
      mensaje: 'Quedamos empatados. Buena partida!',
      icono: '<i class="bi bi-tencent-qq"></i>',
      fondo: './assets/imagenes/nieve.webp',
    })
    
    notificado.mostrar()
    jugadoresActivos[this.jugador].actualizarEstadisticas()
    habilitarCambioDeTurnos()
    activarCambioDeOponente()
    renderBotonPartida('nueva', 'Volver a jugar')
  }

  // Analizar tablero para ver si hay un ganador y devolver el resultado verdadero o falso
  chequearGanador() {
    const casilleros = turnos.map(turno => {
      if (turno.jugador === this.jugador) {
        return turno.casillero
      }
    })
  
    return (
      (casilleros.includes(0) && casilleros.includes(1) && casilleros.includes(2)) ||
      (casilleros.includes(3) && casilleros.includes(4) && casilleros.includes(5)) ||
      (casilleros.includes(6) && casilleros.includes(7) && casilleros.includes(8)) ||
      (casilleros.includes(0) && casilleros.includes(3) && casilleros.includes(6)) ||
      (casilleros.includes(1) && casilleros.includes(4) && casilleros.includes(7)) ||
      (casilleros.includes(2) && casilleros.includes(5) && casilleros.includes(8)) ||
      (casilleros.includes(0) && casilleros.includes(4) && casilleros.includes(8)) ||
      (casilleros.includes(2) && casilleros.includes(4) && casilleros.includes(6))
    )
  }

  // Agregar jugada al array global turnos y actualizar almacenamiento local del navegador y 
  // actualizar tablero HTML
  guardar() {
    turnos.push(this)
    actualizarAlmacenamiento('turnos', turnos)
    renderTableroHTML()
  
    if (turnos.length > 4 && this.chequearGanador()) {
      this.decretarGanador()
    } else {
      const turnoSiguiente = new Turno()
      turnoSiguiente.jugar()
    }
  }

  // Ejecutar jugada de usuario
  realizarJugada = e => {
    const tableroHTML = new TableroHTML()
    tableroHTML.desactivarTableroHTML(this)
    
    this.casillero = tableroHTML.obtenerCasilleroIndex(e.target)

    const casillerosOcupados = tableroHTML.obtenerCasillerosOcupados()
    
    if (!casillerosOcupados.includes(this.casillero)) {
      this.guardar()
    }
  }

  // Generar jugada jugador virtual
  generarJugada = () => {
    let casilleroElegido = false
    const tableroHTML = new TableroHTML()
    const casillerosLibres = tableroHTML.obtenerCasillerosLibres()

    if (jugadoresActivos.virtual.nombre != 'La Máquina' && turnos.length > 2) {
      casilleroElegido = tableroHTML.buscarWinner() || tableroHTML.detectarAmenaza()
    }

    if (casilleroElegido === false) {
      const i = Math.floor(Math.random() * casillerosLibres.length)

      casilleroElegido = casillerosLibres[i]
    }
    
    this.casillero = casilleroElegido
    this.guardar()
  }

  // Desarrollar juego por turnos
  jugar() {
    if (turnos.length == 9) {
      this.decretarEmpate()
    } else {
      const tableroHTML = new TableroHTML()
  
      renderTurno(turnos.length + 1, jugadoresActivos[this.jugador].nombre)
      
      if (this.jugador == 'virtual') {
        setTimeout(
          this.generarJugada,
          500
        )
      } else {
        tableroHTML.activarTableroHTML(this)
      }
    }
  }
}

// Funciones relativas al desarrollo del juego
// Cambiar turnos
const cambiarTurnos = () => {
  jugadoresActivos.usuario.inicia = !jugadoresActivos.usuario.inicia
  jugadoresActivos.usuario.actualizarJugadores(false)
}

// Habilitar botón para cambiar el orden de los turnos de la partida
const habilitarCambioDeTurnos = () => {
  document.getElementById('selector-turnos').addEventListener('click', cambiarTurnos)
}

// Desabilitar botón para cambiar el orden de los turnos de la partida
const deshabilitarCambioDeTurnos = () => {
  document.getElementById('selector-turnos').removeEventListener('click', cambiarTurnos)
}

// Asignar función al botón de partida
const renderBotonPartida = (data, texto) => {
  const botonPartida = document.getElementById('partida')

  botonPartida.dataset.partida = data
  botonPartida.innerText = texto
}

// Inicializar turnos
const inicializarTurno = () => {
  document.getElementById('turno').innerHTML = ''
}

// Indicar a qué jugador corresponde el turno
const renderTurno = (turnoNumero, jugadorNombre) => {
  document.getElementById('turno').innerHTML = turnoNumero ? `Turno #${turnoNumero}: ${jugadorNombre}` : ''
}

// Preparar para el comienzo del juego
const prepararPartida = () => {
  const juego = document.getElementById('juego')
  const carga = document.getElementById('carga')

  habilitarCambioDeTurnos()
  activarCambioDeNombreUsuario()
  activarCambioDeOponente()
  renderTableroHTML()

  // Responder al click en el botón de partida 
  document.getElementById('partida').addEventListener('click', e => {
    const botonPartida = e.target
    
    if (botonPartida.dataset.partida == 'nueva') {
      turnos.length = 0
      eliminarDatosAlmacenados('turnos')
      deshabilitarCambioDeTurnos()
      desactivarCambioDeOponente()
      renderTurno(0)
      renderTableroHTML()
      renderBotonPartida('abandonar', 'Abandonar partida')
      
      const turno = new Turno()
      
      turno.jugar()
    } else if (botonPartida.dataset.partida == 'abandonar') {
      const notificado = new Notificado({
        titulo: 'Lamento que no sigamos jugando...',
        mensaje: 'Aquí te espero para otra apasionante partida!',
        icono: '<i class="bi bi-balloon"></i>',
        fondo: './assets/imagenes/desierto.webp',
      })
      
      notificado.mostrar()
      jugadoresActivos.usuario.actualizarEstadisticas('virtual')
      habilitarCambioDeTurnos()
      activarCambioDeOponente()
      renderBotonPartida('nueva', 'Volver a jugar')
    }
  })

  // Habilitar pantalla de juego
  const renderJuego = () => {
    carga.classList.remove('d-flex')
    carga.classList.add('d-none')
    juego.classList.remove('d-none')
    juego.classList.add('d-block')
  }

  // Simular tiempo de carga de api
  setTimeout(renderJuego, 3000)
}