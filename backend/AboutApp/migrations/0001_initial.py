from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Organogram',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='Organogram of Sindh Information Commission', max_length=255)),
                ('image', models.ImageField(help_text='Upload the organogram image (e.g., PNG, JPG).', upload_to='about/organogram/')),
                ('is_active', models.BooleanField(default=True, help_text='Only one organogram can be active at a time. Activating a new one will deactivate others.')),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Organogram',
                'verbose_name_plural': 'Organogram',
            },
        ),
    ]