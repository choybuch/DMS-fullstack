from django.db import models
from django.core.files.storage import default_storage
from .utils import extract_pdf_text, extract_docx_text, extract_excel_text

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='documents/',
        storage=default_storage
    )
    file_type = models.CharField(max_length=10)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        # Set file type before saving
        if self.file:
            self.file_type = self.file.name.split('.')[-1].lower()
        
        super().save(*args, **kwargs)
        
        # Extract text after saving
        if self.file and not self.extracted_text:
            try:
                if self.file_type == 'pdf':
                    self.extracted_text = extract_pdf_text(self.file)
                elif self.file_type == 'docx':
                    self.extracted_text = extract_docx_text(self.file)
                elif self.file_type in ['xlsx', 'xls']:
                    self.extracted_text = extract_excel_text(self.file)
                elif self.file_type == 'txt':
                    self.file.seek(0)
                    self.extracted_text = self.file.read().decode('utf-8')
                else:
                    self.extracted_text = "Unsupported file type"
                
                # Save again with extracted text
                super().save(update_fields=['extracted_text'])
            except Exception as e:
                print(f"Error extracting text: {str(e)}")