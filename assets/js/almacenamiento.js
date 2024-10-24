// Funciones para el manejo del almacenamiento local del navegador
// Actualizar array de datos en el amacenamiento local del navegador
const actualizarAlmacenamiento = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor))

// Cargar datos del almacenamiento local del navegador
const cargarDatosAlmacenados = clave => JSON.parse(localStorage.getItem(clave))

// Eliminar datos del almacenamiento local del navegador
const eliminarDatosAlmacenados = clave => localStorage.removeItem(clave)