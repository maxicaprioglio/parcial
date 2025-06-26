from rest_framework import serializers
from web.models import Postulantes

class PostulanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postulantes
        fields = '__all__'  
