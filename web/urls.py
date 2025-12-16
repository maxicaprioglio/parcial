from django.urls import path
from . import views

urlpatterns = [
    path('', views.pagina_inicio, name='index'),
    path('contacto/', views.contacto, name='contacto'),
    path('forma_parte/', views.forma_parte, name='forma_parte'),
    path('proyectos/', views.proyectos, name='proyectos'),
    path('panel/', views.panel, name='panel'),
    path('api/consultas/', views.consultas_api, name='consultas_api'),
    path('api/frases/random/', views.consultas_api_frases, name='consultas_api_frases'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('registro/', views.registro_view, name='registro'),
    path('activar/<str:token>/', views.activar_usuario, name='activar_usuario'),
    path('eliminar/<int:consulta_id>/', views.eliminar_consulta, name='eliminar_consulta'),
    path('editar/<int:consulta_id>/', views.editar_consulta, name='editar_consulta'),
    path('administrar/', views.administrar, name='administrar'),
]