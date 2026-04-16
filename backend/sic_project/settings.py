"""
Django settings for sic_project project.
"""

import os
import dj_database_url
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-%$+5!2l@u11_0p^c3)+aw!_c#%zpx@w&9)2+hk5*3y!d5^7jv_')

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = [
    'sindhinformationcommission-production.up.railway.app',
    'sic.daibul.com',
    'localhost',
    '127.0.0.1',
    '.railway.app'
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django_filters',
    'complaint',
    'commissioners',
    'publicBodies',
    'staff',
    'LawAndResources',
    'stats',
    'InfoDesk',
    'EventNotifications',
    'Careers',
    'CauseList',
    'GalleryApp',
    'IPRequestsApp',
    'AnnualReportApp',
    'ActApp',
    'CommissionOverviewApp',
    'SICBudgetApp',
    'ckeditor',
    'AboutApp.apps.AboutappConfig',
    'WebsiteSettingsApp.apps.WebsitesettingsappConfig',
    'NotificationApp.apps.NotificationappConfig',
]

MIDDLEWARE = [
    'sic_project.middleware.AllowFramingMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'IPRequestsApp.middleware.AdminIPRestrictionMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'sic_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR.parent,  # Points to d:\SIC\SICommission\ where index.html is
            BASE_DIR / 'dist',
            BASE_DIR / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sic_project.wsgi.application'

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'postgres://postgres:07860786@localhost:5432/sic_db'),
        conn_max_age=600,
        ssl_require=not DEBUG
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ===================== STATIC FILES FOR VITE REACT BUILD =====================
STATIC_URL = '/static/'

# IMPORTANT: Only point to the 'assets' folder inside dist
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'dist'),
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Security & CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://sic.daibul.com",
]

CSRF_TRUSTED_ORIGINS = [
    "https://sic.daibul.com",
    "https://sindhinformationcommission-production.up.railway.app",
]

# CKEditor
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Full',
        'height': 300,
        'width': '100%',
        'enterMode': 2,
        'shiftEnterMode': 1,
    },
    'rtl_config': {
        'toolbar': 'Full',
        'height': 300,
        'width': '100%',
        'contentsLangDirection': 'rtl',
        'enterMode': 2,
        'shiftEnterMode': 1,
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
