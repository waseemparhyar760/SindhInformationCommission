from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title_en', models.CharField(max_length=255, verbose_name='Title (English)')),
                ('title_ur', models.CharField(blank=True, max_length=255, verbose_name='Title (Urdu)')),
                ('title_sd', models.CharField(blank=True, max_length=255, verbose_name='Title (Sindhi)')),
                ('description_en', models.TextField(blank=True, verbose_name='Description (English)')),
                ('description_ur', models.TextField(blank=True, verbose_name='Description (Urdu)')),
                ('description_sd', models.TextField(blank=True, verbose_name='Description (Sindhi)')),
                ('file', models.FileField(blank=True, help_text='Optional PDF or Document', null=True, upload_to='notifications/')),
                ('link', models.URLField(blank=True, help_text='Optional external link', null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Notification',
                'verbose_name_plural': 'Notifications',
                'ordering': ['-created_at'],
            },
        ),
    ]
