from rest_framework import serializers
from .models import Department
from accounts.models import User
from django.contrib.auth.hashers import make_password
from django.db import transaction

class DepartmentSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'logo', 'logo_url', 'name', 'tagline', 'bio', 'ceo_name', 
                  'email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None

class DepartmentCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    
    class Meta:
        model = Department
        fields = ['logo', 'name', 'tagline', 'bio', 'ceo_name', 'email', 'password']
    
    def validate_email(self, value):
        # Check if email already exists in User model
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        logo = validated_data.get('logo', None)

        # Derive a unique username from the email's local part. Two departments
        # can share a local part (e.g. hr@a.com and hr@b.com); append a numeric
        # suffix so we never hit a UNIQUE-constraint error on username.
        base_username = validated_data['email'].split('@')[0].strip() or 'department'
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            suffix += 1
            username = f"{base_username}{suffix}"

        ceo_name = (validated_data.get('ceo_name') or '').strip()
        first_name = ceo_name.split()[0] if ceo_name else ''

        # Create the user and department together so a failure can't leave an
        # orphaned user account behind.
        with transaction.atomic():
            user = User.objects.create(
                username=username,
                email=validated_data['email'],
                user_type='department',
                password=make_password(password),
                first_name=first_name,
                is_active=True,
                profile_picture=logo,  # mirror the department logo onto the user
            )
            department = Department.objects.create(
                user=user,
                **validated_data
            )

        return department

class DepartmentDetailSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    total_jobs = serializers.SerializerMethodField()
    total_employees = serializers.SerializerMethodField()
    active_jobs = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'logo', 'logo_url', 'name', 'tagline', 'bio', 'ceo_name', 
                  'email', 'created_at', 'updated_at', 'total_jobs', 'total_employees', 
                  'active_jobs']
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None
    
    def get_total_jobs(self, obj):
        return obj.jobs.count()
    
    def get_total_employees(self, obj):
        return obj.employees.count()
    
    def get_active_jobs(self, obj):
        return obj.jobs.filter(status='open').count()