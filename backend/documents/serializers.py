# documents/serializers.py
from rest_framework import serializers
from django.conf import settings
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'file_url', 'file_type', 'uploaded_at', 'extracted_text']
        read_only_fields = ['file_url', 'file_type', 'uploaded_at', 'extracted_text']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request is not None:
                # Generate full URL including domain and media URL
                return request.build_absolute_uri(obj.file.url)
            # Fallback to relative URL if no request context
            return obj.file.url if obj.file else None
        return None

    def validate_file(self, value):
        if not value:
            raise serializers.ValidationError("File is required")
        
        # Get file extension
        file_ext = value.name.split('.')[-1].lower()
        
        # Define allowed extensions
        allowed_extensions = ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'xls']
        
        if file_ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Check file size (10MB limit)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB")
            
        return value

    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("Title is required")
        return value

    def create(self, validated_data):
        if 'title' not in validated_data:
            # Use filename as title if not provided
            validated_data['title'] = validated_data['file'].name
        return super().create(validated_data)