$('#perfiles').ready(function () {
    $(".chosen-select").chosen({
        no_results_text: "No se encontraron resultados de :",
        width: "100%",
        heigth: "100%",
    });
});
const guardar = document.getElementById('guardar');
let validacionGuardar;
let dataMenu;
let cargaUtilAccesos = {};
let idperfil_seleccionado;
const contenedorLoader = document.getElementById("loaderContainer");
function manejarSeleccionPerfil(event) {
    const idperfil = event.target.value;
    idperfil_seleccionado = idperfil;
    listarModulosConPermisos(idperfil);
}

function removerloaderEntradas() {
    const selectPerfil = document.getElementById('perfiles').parentElement.querySelector('.loader-overlay');
    selectPerfil.classList.remove('active');
    const contenedorAccesos = document.getElementById('seccionAccesos').parentElement.querySelector('.loader-overlay');
    contenedorAccesos.classList.remove('active');
}

function activarLoaderEntradas() {
    const selectPerfil = document.getElementById('perfiles').parentElement.querySelector('.loader-overlay');
    selectPerfil.classList.add('active');
    const contenedorAccesos = document.getElementById('seccionAccesos').parentElement.querySelector('.loader-overlay');
    contenedorAccesos.classList.add('active');
}

function listarModulosConPermisos(idperfil) {
    if (Object.keys(cargaUtilAccesos).length !== 0) cargaUtilAccesos = {};
    validarBotonGuardar();
    $("#seccionAccesos").jstree("destroy");
    const seccionInicial = document.getElementById('seccionInicial');
    if (seccionInicial) seccionInicial.remove();
    activarLoaderEntradas();
    fetch(`/accesos/listar-modulos-permisos/${idperfil}`)
        .then((res) => {
            removerloaderEntradas();
            if (!res.ok) {
                return res.json().then((data) => Promise.reject(data));
            }
            return res.json();
        })
        .then((data) => {
            dataMenu = data.data;
            postCargaUtilAccesos(data.data, Number(idperfil));
            const cargaUtilJstree = construirCargaUtilJstree(data.data);
            construirHtmlJstree(cargaUtilJstree);
            validarBotonGuardar();
        })
        .catch((error) => {
            console.log(error)
        });
}

function postCargaUtilAccesos(data, idPerfil) {
    const cargaUtil = {
        id_perfil: idPerfil,
        permisos: []
    };
    data.forEach(moduloPadre => {
        if (moduloPadre.modulos && moduloPadre.modulos.length > 0) {
            moduloPadre.modulos.forEach(modulo => {
                const acciones = modulo.funciones
                    .filter(funcion => funcion.flag_acceso)
                    .map(funcion => funcion.prefijo);
                if (acciones.length > 0) {
                    cargaUtil.permisos.push({
                        idmodulo: modulo.id,
                        acciones: acciones
                    });
                }
            });
        }
    });
    cargaUtilAccesos = { ...cargaUtil };
}

function construirCargaUtilJstree(data) {
    const cargaUtilJstree = [];
    let indice = 0;
    for (let modulopadre of data) {
        cargaUtilJstree[indice] = {};
        cargaUtilJstree[indice]['text'] = modulopadre['nombre'];
        cargaUtilJstree[indice]['id'] = String(modulopadre['id']);
        if (modulopadre['modulos'].length > 0) {
            cargaUtilJstree[indice]['children'] = [];
        } else {
            cargaUtilJstree[indice]['state'] = { disabled: true }
        }
        if (cargaUtilJstree[indice]['children']) {
            let indiceModulo = 0;
            for (let modulo of modulopadre['modulos']) {
                cargaUtilJstree[indice]['children'][indiceModulo] = {
                    id: `${modulo['id']}.${modulopadre['id']}`,
                    text: modulo['nombre'],
                    children: []
                }
                let indiceFuncion = 0;
                for (let funcion of modulo['funciones']) {
                    cargaUtilJstree[indice]['children'][indiceModulo]['children'][indiceFuncion] = {
                        id: `${funcion['id']}.${modulo['id']}.${modulopadre['id']}`,
                        text: funcion['nombre'],
                        state: { selected: funcion['flag_acceso'] }
                    }
                    indiceFuncion++;
                }
                indiceModulo++;
            }

        }
        indice++;
    }
    return cargaUtilJstree;
}

function construirHtmlJstree(cargaUtil) {
    $("#seccionAccesos")
        .jstree({
            plugins: ["wholerow", "checkbox", "types"],
            core: {
                data: cargaUtil
            },
            types: {
                default: {
                    icon: "ki-solid ki-folder text-warning",
                },
                file: {
                    icon: "ki-solid ki-file  text-warning",
                },
            },
        })
        .on("select_node.jstree", manejarSeleccionJstree)
        .on("deselect_node.jstree", manejarDeseleccionJstree);
}

function manejarSeleccionJstree(e, data) {
    const node = data.node;
    const id = data.node.id;
    const nivelSeleccion = node.parents.length;
    if (nivelSeleccion === 1) {
        seleccionPrimerNivel(Number(id));
    } else if (nivelSeleccion === 2) {
        seleccionSegundoNivel(id);
    }else {
        seleccionTercerNivel(id);
    }
    validarBotonGuardar();
}

function manejarDeseleccionJstree(e, data) {
    const node = data.node;
    const id = data.node.id;
    const nivelSeleccion = node.parents.length;
    if (nivelSeleccion === 1) {
        deseleccionPrimerNivel(Number(id));
    } else if (nivelSeleccion === 2) {
        deseleccionSegundoNivel(id);
    }else {
        deseleccionTercerNivel(id);
    }
    validarBotonGuardar();
}

function seleccionPrimerNivel(id) {
    let idsModulos = [];
    let accesos = [];
    for (let menu of dataMenu) {
        if (menu.id === id) {
            for (let modulo of menu.modulos) {
                idsModulos.push(modulo.id);
                let objetoAccesos = {
                    idmodulo: modulo.id,
                    acciones: modulo.funciones.map(funcion => funcion.prefijo)
                };
                accesos.push(objetoAccesos);
            }
        }
    }
    cargaUtilAccesos.permisos = cargaUtilAccesos.permisos.filter(
        permiso => !idsModulos.includes(permiso.idmodulo)
    );
    cargaUtilAccesos.permisos.push(...accesos);
}

function seleccionSegundoNivel(id) {
    const idmodulo = parseInt(id.split('.')[0], 10);
    const idmodulopadre = parseInt(id.split('.')[1], 10);
    let accesos = [];
    for (let menu of dataMenu) {
        if (menu.id === idmodulopadre) {
            for (let modulo of menu.modulos) {
                if (modulo.id === idmodulo) {
                    let objetoAccesos = {
                        idmodulo: modulo.id,
                        acciones: modulo.funciones.map(funcion => funcion.prefijo)
                    };
                    accesos.push(objetoAccesos);
                    break;
                }
            }
        }
    }
    let indexPermiso = cargaUtilAccesos.permisos.findIndex(permiso => permiso.idmodulo === idmodulo);
    if (indexPermiso !== -1) {
        cargaUtilAccesos.permisos[indexPermiso].acciones = accesos[0].acciones;
    } else {
        cargaUtilAccesos.permisos.push(accesos[0]);
    }
}

function seleccionTercerNivel(id) {
    const idfuncion = parseInt(id.split('.')[0], 10);
    const idmodulo = parseInt(id.split('.')[1], 10);
    const idmodulopadre = parseInt(id.split('.')[2], 10);
    let accesos = [];
    for (let menu of dataMenu) {
        if (menu.id === idmodulopadre) {
            for (let modulo of menu.modulos) {
                if (modulo.id === idmodulo) {
                    let objetoAccesos = {
                        idmodulo: modulo.id,
                        acciones: modulo.funciones
                            .filter(funcion => funcion.id === idfuncion)
                            .map(funcion => funcion.prefijo)
                    };
                    accesos.push(objetoAccesos);
                    break;
                }
            }
        }
    }
    let indexPermiso = cargaUtilAccesos.permisos.findIndex(permiso => permiso.idmodulo === idmodulo);
    if (indexPermiso !== -1) {
        accesos[0].acciones.forEach(accion => {
            if (!cargaUtilAccesos.permisos[indexPermiso].acciones.includes(accion)) {
                cargaUtilAccesos.permisos[indexPermiso].acciones.push(accion);
            }
        });
    } else {
        cargaUtilAccesos.permisos.push(accesos[0]);
    }
}

function deseleccionPrimerNivel(id) {
    let idsModulos = [];
    for (let menu of dataMenu) {
        if (menu.id === id) {
            for (let modulo of menu.modulos) {
                idsModulos.push(modulo.id);
            }
        }
    }
    cargaUtilAccesos.permisos = cargaUtilAccesos.permisos.filter(
        permiso => !idsModulos.includes(permiso.idmodulo)
    );
}

function deseleccionSegundoNivel(id) {
    const idmodulo = parseInt(id.split('.')[0], 10);
    cargaUtilAccesos.permisos = cargaUtilAccesos.permisos.filter(
        permiso => permiso.idmodulo !== idmodulo
    );
}

function deseleccionTercerNivel(id) {
    const idfuncion = parseInt(id.split('.')[0], 10);
    const idmodulo = parseInt(id.split('.')[1], 10);
    const idmodulopadre = parseInt(id.split('.')[2], 10);
    for (let menu of dataMenu) {
        if (menu.id === idmodulopadre) {
            for (let modulo of menu.modulos) {
                if (modulo.id === idmodulo) {
                    let indexAccion = cargaUtilAccesos.permisos.findIndex(permiso => permiso.idmodulo === idmodulo);
                    if (indexAccion !== -1) {
                        cargaUtilAccesos.permisos[indexAccion].acciones = cargaUtilAccesos.permisos[indexAccion].acciones.filter(accion => {
                            return accion !== modulo.funciones.find(funcion => funcion.id === idfuncion)?.prefijo;
                        });
                    }
                    break;
                }
            }
        }
    }
    cargaUtilAccesos.permisos = cargaUtilAccesos.permisos.filter(permiso => permiso.acciones.length > 0);
}

function validarBotonGuardar() {
    let validacionCompleta = true;
    if (Object.keys(cargaUtilAccesos).length === 0) {
        validacionCompleta = false;
    } else if(cargaUtilAccesos['permisos'].length === 0) {
        validacionCompleta = false;
    }   
    if (guardar.disabled !== !validacionCompleta) guardar.disabled = !validacionCompleta;
    validacionGuardar = validacionCompleta;
}

guardar.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validacionGuardar) return;
    activarLoader();
    fetch("/accesos/asignar-permisos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cargaUtilAccesos),
    })
        .then((res) => {
            contenedorLoader.style.display = "none";
            if (!res.ok) {
                return res.json().then((data) => Promise.reject(data));
            }
            return res.json();
        })
        .then((data) => {
            if (data.success) {
                mostrarAlerta("alert-success", "Éxito : ", data.message);
                listarModulosConPermisos(idperfil_seleccionado);
            }
        })
        .catch((error) => {
            if (error.statusCode === 400) {
                mostrarAlerta("alert-warning", "Advertencia : ", error.message);
            }
        });
});

function mostrarAlerta(tipo, titulo, mensaje) {
    const alert = document.getElementById("alertWarning");
    const strongElement = document.getElementById("alertStrongText");
    const messageElement = document.getElementById("alertMessageText");
    strongElement.textContent = titulo;
    messageElement.textContent = mensaje;
    alert.classList.remove(
        "alert-success",
        "alert-warning",
        "alert-danger",
        "alert-info"
    );
    alert.classList.remove("d-none");
    alert.classList.add(tipo);
    setTimeout(() => cerrarAlerta(tipo), 5000);
}

function cerrarAlerta(tipo) {
    const alert = document.getElementById("alertWarning");
    alert.classList.add("d-none");
    alert.classList.remove(tipo);
}

function activarLoader() {
    contenedorLoader.style.display = "flex";
    contenedorLoader.style.alignItems = "center";
    contenedorLoader.style.justifyContent = "center";
}
