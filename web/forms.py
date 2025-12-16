import re
from django import forms
from web.models import Proyecto

class ConsultaForm(forms.Form):
    nombre = forms.CharField(
        label='Nombre',
        max_length=100,
        error_messages={
            'required': 'El nombre es obligatorio.',
            'max_length': 'El nombre no puede superar los 100 caracteres.'
        },
        widget=forms.TextInput(attrs={
            'class': 'form-control texto-formulario',
            'placeholder': 'Nombre y apellido',
            'id': 'nombre',
            'required': 'required'
        })
    )
    apellido = forms.CharField(
        label='Apellido',
        max_length=100,
        error_messages={
            'required': 'El apellido es obligatorio.',
            'max_length': 'El apellido no puede superar los 100 caracteres.'
        },
        widget=forms.TextInput(attrs={
            'class': 'form-control texto-formulario',
            'placeholder': 'Nombre y apellido',
            'id': 'apellido',
            'required': 'required'
        })
    )

    email = forms.EmailField(
        label='Email',
        error_messages={
            'required': 'El email es obligatorio.',
            'invalid': 'Ingresa un email válido.'
        },
        widget=forms.EmailInput(attrs={
            'class': 'form-control texto-formulario',
            'placeholder': 'Correo electrónico',
            'id': 'email',
            'required': 'required'
        })
    )

    mensaje = forms.CharField(
        label='Mensaje',
        error_messages={
            'required': 'El mensaje es obligatorio.',
        },
        widget=forms.Textarea(attrs={
            'class': 'form-control texto-formulario',
            'placeholder': 'Escribe tu mensaje aquí',
            'id': 'mensaje',
            'required': 'required'
        })
    )
    
    def clean_nombre(self):
        nombre = self.cleaned_data.get('nombre')
        if not re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$', nombre):
            raise forms.ValidationError("El nombre solo debe contener letras y espacios.")
        return nombre

    def clean_apellido(self):
        apellido = self.cleaned_data.get('apellido')
        if not re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$', apellido):
            raise forms.ValidationError("El apellido solo debe contener letras y espacios.")
        return apellido

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            raise forms.ValidationError("Ingresa un email válido.")
        return email
    
class ProyectoForm(forms.ModelForm):
    class Meta:
        model = Proyecto
        fields = ['titulo', 'descripcion']

