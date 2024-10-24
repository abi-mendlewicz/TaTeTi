// Variables globales
const jugadoresVirtuales = []
const jugadoresActivos = {}
const jugadoresOrdenados = []

// Clase para manejar los objetos jugador
class Jugador {
  constructor(jugador) {
    this.nombre = jugador.nombre
    this.inicia = jugador?.inicia
    this.ganados = jugador?.ganados || 0
    this.empatados = jugador?.empatados || 0
    this.perdidos = jugador?.perdidos || 0
  }

  // Establecer el orden de juego
  ordenarJugadores() {
    jugadoresOrdenados[0] = jugadoresActivos.usuario.inicia ? 'usuario' : 'virtual'
    jugadoresOrdenados[1] = jugadoresActivos.usuario.inicia ? 'virtual' : 'usuario'
  }

  // Mostrar jugadores en pantalla
  renderJugadores() {
    const jugadoresHTML = [
      document.getElementById('jugador1'),
      document.getElementById('jugador2'),
    ]
    let oponentes = ''

    jugadoresVirtuales.forEach((jugador, i) => {
      oponentes += `
        <option value="${i}" ${jugadoresActivos.virtual.nombre == jugador.nombre ? 'selected' : ''}>
          ${jugador.nombre}
        </option>`
    })

    jugadoresOrdenados.forEach((jugador, i) => {
      const componenteNombre = jugador == 'usuario'
        ? `<p class="d-flex justify-content-between align-items-center fs-5">
            <span class="py-1 px-3">${jugadoresActivos[jugador].nombre}</span>
            <i id="editar-nombre" class="btn py-1 px-3 bi bi-pencil" title="Editar nombre" aria-label="Editar nombre"></i>
          </p>`
        : `<p>
            <select id="jugador-virtual" class="form-select fs-5" aria-label="Seleccionar oponente virtual">
              ${oponentes}
            </select>
          </p>`

      jugadoresHTML[i].innerHTML = `
        ${componenteNombre}
        <table class="table m-0">
          <thead>
            <tr>
              <th scope="col">G</th>
              <th scope="col">E</th>
              <th scope="col">P</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${jugadoresActivos[jugador].ganados}</td>
              <td>${jugadoresActivos[jugador].empatados}</td>
              <td>${jugadoresActivos[jugador].perdidos}</td>
            </tr>
          </tbody>
        </table>`
    })

    activarCambioDeNombreUsuario()
    activarCambioDeOponente()
  }

  // Actualizar almacenamiento local, orden de juego y jugadores en pantalla
  actualizarJugadores(inicializar = true, ordenar = true) {
    actualizarAlmacenamiento('jugadoresActivos', jugadoresActivos)
    ordenar && this.ordenarJugadores()
    this.renderJugadores()
    inicializar && prepararPartida()
  }

  // Cargar jugadores virtuales desde la api y poblar los objetos jugadoresVirtuales y jugadoresActivos
  async asignarOponenteVirtual(jugadorVirtualAlmacenado) {
    try {
      const promesa = await fetch('assets/data/jugadores-virtuales.json')
      const jugadores = await promesa.json()

      if (!jugadores) {
        jugadores = [{nombre: 'La Máquina'}]
      }

      jugadoresVirtuales.push(...jugadores)

      const jugadorVirtual = jugadorVirtualAlmacenado ? jugadorVirtualAlmacenado : jugadoresVirtuales[0]
      
      jugadoresActivos.virtual = new Jugador(jugadorVirtual)
      this.actualizarJugadores()
    } catch {
      jugadoresVirtuales.push({nombre: 'La Máquina'})
      jugadoresActivos.virtual = new Jugador(jugadoresVirtuales[0])
      this.actualizarJugadores()
    }
  }

  // Actualizar estadistica de jugadores
  actualizarEstadisticas(ganador) {
    jugadoresOrdenados.forEach(jugador => {
      if (!ganador) {
        jugadoresActivos[jugador].empatados += 1
      } else if (jugador == ganador) {
        const oponente = jugadoresOrdenados.find(_jugador => _jugador != jugador)
  
        jugadoresActivos[jugador].ganados += 1
        jugadoresActivos[oponente].perdidos += 1
      }
    })

    this.actualizarJugadores(false, false)
  }
}

// Funciones relativas a los jugadores
// Inicializar array de jugadores activos con los datos almacenados localmente en el navegador o por defecto
const inicializarJugadores = () => {
  const {
    usuario: usuarioAlmacenado,
    virtual: jugadorVirtualAlmacenado
  } = cargarDatosAlmacenados('jugadoresActivos') || {usuario: null, virtual: null}
  
  jugadoresActivos.usuario = usuarioAlmacenado
    ? new Jugador(usuarioAlmacenado)
    : new Jugador({
        nombre: 'Usuario',
        inicia: true,
      })

  jugadoresActivos.usuario.asignarOponenteVirtual(jugadorVirtualAlmacenado)
}

// Enlazar evento click al botón editar nombre de usuario
const activarCambioDeNombreUsuario = () => {
  document.getElementById('editar-nombre').addEventListener('click', async e => {
    const { value: nuevoNombre } = await Swal.fire({
      title: 'Cabiar nombre',
      input: 'text',
      inputLabel: 'Tu nuevo nombre',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Tu nombre no puede estar vacío.'
        }
      }
    });
    if (nuevoNombre) {
      jugadoresActivos.usuario.nombre = nuevoNombre
      jugadoresActivos.usuario.actualizarJugadores(false, false)
    }
  })
}

// Enlazar evento change al select de jugador virtual
const activarCambioDeOponente = () => {
  document.querySelector('select').addEventListener('change', e => {
    const jugadorSaliente = jugadoresActivos.virtual
    const jugadorSalienteIndex = jugadoresVirtuales.findIndex(jugador => jugador.nombre == jugadorSaliente.nombre)
    
    jugadoresVirtuales[jugadorSalienteIndex] = {...jugadorSaliente}
    jugadoresActivos.virtual = new Jugador(jugadoresVirtuales[e.target.value])
    jugadoresActivos.virtual.actualizarJugadores(false, false)
  })
}

// Desenlazar evento click en los casilleros para no permitir generar jugadas al usuario
const desactivarCambioDeOponente = () => {
  document.getElementById('jugador-virtual').setAttribute('disabled', '')
}