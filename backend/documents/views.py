from django.db.models import Q
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Document
from .serializers import DocumentSerializer

# documents/views.py
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    
    def get_serializer_context(self):
        return {'request': self.request}

class SearchAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        file_type = request.query_params.get('type', 'all')
        
        documents = Document.objects.all()
        
        if query:
            documents = documents.filter(
                Q(title__icontains=query) | 
                Q(extracted_text__icontains=query)
            )
        
        if file_type != 'all':
            documents = documents.filter(file_type=file_type)
        
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)