// Clase para manejar notificaciones con sweetalert2
class Notificado {
  constructor({titulo, mensaje, icono, fondo}) {
    this.titulo = titulo
    this.mensaje = mensaje
    this.icono = icono
    this.fondo = fondo
  }
  
  // Mostrar notificación
  mostrar() {
    Swal.fire({
      title: this.titulo,
      text: this.mensaje,
      icon: 'success',
      iconHtml: this.icono,
      showConfirmButton: true,
      backdrop: `url(${this.fondo}) center/100%`,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      },
      customClass: {
        icon: 'notificado-icono',
      },
    })
  }
}