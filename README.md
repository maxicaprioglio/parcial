### Programación Web 2

Docente: Analía Villegas
Alumno: Maximiliano caprioglio
Año: 2025

## Final





### API´s
## Interna:
# API Interna - Proyecto Django con DRF

Este proyecto expone endpoints internos utilizando **Django REST Framework (DRF)**.  
El consumo está pensado para realizarse desde la propia aplicación web y los endpoints requieren que el usuario esté autenticado.

---

📌 Endpoint: `/api/consultas/`

**Método:** `GET`  
**Descripción:** Devuelve la lista completa de postulantes registrados en el sistema.  

🔒 Autenticación
- El usuario debe estar logueado en la aplicación para acceder.  
- El acceso se valida mediante la **cookie de sesión** generada por Django al iniciar sesión (`sessionid`).  
- Si se intenta acceder sin estar autenticado, el servidor devolverá un error.

📄 Ejemplo de consumo (Postman)
1. Realizar login en el endpoint de autenticación (`/api/auth/login/`) con usuario y contraseña.  
2. Guardar la cookie `sessionid` que devuelve el servidor.  
3. Enviar la petición a `/api/consultas/` incluyendo la cookie en el header:

# API Externa:

Este proyecto expone un endpoint en Django que actúa como proxy hacia una API externa de frases.
El objetivo es que el frontend consuma este endpoint local sin necesidad de autenticación, y que el backend se encargue de solicitar la frase a la API externa.

🔹 Endpoint disponible
- URL: /api/frases/random/
- Método: GET
- Autenticación: No requiere
- Respuesta: JSON con la estructura:
{
  "frase": "Texto de la frase",
  "autor": "Nombre del autor"
}


En caso de error:
{
  "error": "Descripción del error"
}

Api externa que devuelve frases con su autor

https://blue-bee-464003.hostingersite.com/frases/random
Desarrollada por Maximiliano Caprioglio en Laravel.