import requests
from django.shortcuts import render, redirect
from django.core.validators import validate_email, URLValidator
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.urls import reverse
from django.conf import settings
from django.core.signing import Signer, BadSignature
from django.core.mail import send_mail
from web.models import CustomUser
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from web.forms import ConsultaForm
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from web.models import Postulantes  
from web.serializers import PostulanteSerializer  



from web.models import Postulantes

# Create your views here.
def pagina_inicio(request):
    return render(request,'web/index.html')

def forma_parte(request):
    errores = []

    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "JSON inválido"})

        nombre = data.get("nombre")
        apellido = data.get("apellido")
        email = data.get("email")
        linkedin = data.get("linkedin")
        mensaje = data.get("mensaje")

        if not nombre:
            errores['nombre'] = "El campo 'Nombre' es obligatorio."
        if not apellido:
            errores['apellido'] = "El campo 'Apellido' es obligatorio."
        if not email:
            errores['email'] = "El campo 'Email' es obligatorio."
        else:
            try:
                validate_email(email)
            except ValidationError:
                errores['email'] = "El correo ingresado no es válido."

        if linkedin:
            try:
                URLValidator()(linkedin)
            except ValidationError:
                errores['linkedin'] = "La URL de LinkedIn no es válida."

        if not mensaje:
            errores['mensaje'] = "El campo 'Mensaje' es obligatorio."

        if errores:
            return JsonResponse({
                        "success": False,
                        "errores": errores
                        })
        else:
            
            nuevo_postulante = Postulantes(
                categoria="RRHH",
                nombre=nombre,
                apellido=apellido,
                mail=email,
                linkedin=linkedin,
                mensaje=mensaje
            )
            try:
                nuevo_postulante.save()
            except ValidationError:
                errores['error_mensaje'] = "Error al guardar el mensaje. Por favor, inténtalo de nuevo."

        return JsonResponse({
            "success": len(errores) == 0,
            "errores": errores
        })
    return render(request, 'web/forma_parte.html')

    
def nosotros(request):
    return render(request,'web/nosotros.html')

def contacto(request):
    errores = []

    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "JSON inválido"})

        nombre = data.get("nombre")
        apellido = data.get("apellido")
        email = data.get("email")
        mensaje = data.get("mensaje")

        if not nombre:
            errores['nombre'] = "El campo 'Nombre' es obligatorio."
        if not apellido:
            errores['apellido'] = "El campo 'Apellido' es obligatorio."
        if not email:
            errores['email'] = "El campo 'Email' es obligatorio."
        else:
            try:
                validate_email(email)
            except ValidationError:
                errores['email'] = "El correo ingresado no es válido."

        if not mensaje:
            errores['mensaje'] = "El campo 'Mensaje' es obligatorio."

        if errores:
            return JsonResponse({
                        "success": False,
                        "errores": errores
                        })
        else:
            mensaje = mensaje.lower()
            categoria = ""

            if any(palabra in mensaje for palabra in ["precio", "costo", "tarifa", "compra"]):
                categoria = "Comercial"
            elif any(palabra in mensaje for palabra in ["soporte", "error", "problema", "ayuda"]):
                categoria = "Técnica"
            elif any(palabra in mensaje for palabra in ["trabajo", "cv", "empleo", "linkedin"]):
                categoria = "RRHH"
            else:
                categoria = "General"
            
            nuevo_postulante = Postulantes(
                categoria=categoria,
                nombre=nombre,
                apellido=apellido,
                mail=email,
                linkedin="",
                mensaje=mensaje
            )
            try:
                nuevo_postulante.save()
            except ValidationError:
                errores['error_mensaje'] = "Error al guardar el mensaje. Por favor, inténtalo de nuevo."

        return JsonResponse({
            "success": len(errores) == 0,
            "errores": errores
        })
    return render(request, 'web/contacto.html')

def proyectos(request):
    return render(request,'web/proyectos.html')

@user_passes_test(lambda u: u.is_authenticated and u.is_valid)
def panel(request):
    return render(request, 'web/panel.html')

@user_passes_test(lambda u: u.is_authenticated and u.is_valid)
def eliminar_consulta(request, consulta_id):
    try:
        consulta = Postulantes.objects.get(id=consulta_id)
        consulta.delete()
        return redirect('panel')
    except Postulantes.DoesNotExist:
        return render(request, 'creditos/panel.html', {'error': 'Consulta no encontrada'})

@user_passes_test(lambda u: u.is_authenticated and u.is_valid)
def editar_consulta(request, consulta_id):
    consulta = get_object_or_404(Consulta, id=consulta_id)

    if request.method == 'POST':
        form = ConsultaForm(request.POST, instance=consulta)
        if form.is_valid():
            form.save()
            return redirect('panel')
    else:
        form = ConsultaForm(instance=consulta)

    return render(request, 'creditos/editar_consulta.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email').strip().lower()
        password = request.POST.get('password')

        user = authenticate(email=email, password=password)

        if user is not None:
            if user.is_valid:
                login(request, user)
                return redirect('panel')
            else:
                messages.error(request, 'Tu cuenta aún no está validada. Revisá tu correo.')
        else:
            messages.error(request, 'Email o contraseña incorrectos.')

    return render(request, 'web/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

signer = Signer()

def registro_view(request):
    if request.method == 'POST':
        email = request.POST.get('email').strip().lower()
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if password != password2:
            messages.error(request, 'Las contraseñas no coinciden.')
            return render(request, 'web/registro.html')

        if email not in settings.MAILS_HABILITADOS:
            messages.error(request, 'Tu email no está habilitado para registrarte.')
            return render(request, 'web/registro.html')

        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, 'Este email ya está registrado.')
            return render(request, 'web/registro.html')

        user = CustomUser.objects.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )

        token = signer.sign(user.pk)
        link = request.build_absolute_uri(reverse('activar_usuario', kwargs={'token': token}))

        send_mail(
            subject='Activa tu cuenta',
            message=f'¡Bienvenido! Hacé clic en este link para validar tu cuenta: {link}',
            from_email='maximiliano.caprioglio@lalupitacontenidos.site',
            recipient_list=[email],
            fail_silently=False
        )

        messages.success(request, 'Tu cuenta fue creada. Revisá tu mail para activarla.')
        return redirect('login')

    return render(request, 'web/registro.html')

def activar_usuario(request, token):
    try:
        user_id = signer.unsign(token)
        user = CustomUser.objects.get(pk=user_id)
        user.is_valid = True
        user.save()
        messages.success(request, 'Tu cuenta fue activada. Ya podés iniciar sesión.')
    except (BadSignature, CustomUser.DoesNotExist):
        messages.error(request, 'El enlace de activación no es válido.')

    return redirect('login')

@api_view(['GET'])
@user_passes_test(lambda u: u.is_authenticated and u.is_valid)
def consultas_api(request):
    postulantes = Postulantes.objects.all()
    serializer = PostulanteSerializer(postulantes, many=True)
    return Response(serializer.data)
