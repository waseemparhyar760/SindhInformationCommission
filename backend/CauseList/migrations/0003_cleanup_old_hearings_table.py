from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('CauseList', '0002_remove_causelist_title_causelist_is_approved_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql='DROP TABLE IF EXISTS "CauseList_causelist_hearings";',
            reverse_sql=migrations.RunSQL.noop
        ),
    ]