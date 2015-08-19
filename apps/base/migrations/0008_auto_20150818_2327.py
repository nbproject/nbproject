# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_auto_20150814_2310'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='last_reminder',
            field=models.DateTimeField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assignmentgrade',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 19740)),
        ),
        migrations.AlterField(
            model_name='assignmentgradehistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 21985)),
        ),
        migrations.AlterField(
            model_name='commentlabel',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 27302)),
        ),
        migrations.AlterField(
            model_name='commentlabelhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 29286)),
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 12924)),
        ),
        migrations.AlterField(
            model_name='guesthistory',
            name='t_start',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 16377), null=True),
        ),
        migrations.AlterField(
            model_name='guestloginhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 17990), null=True),
        ),
        migrations.AlterField(
            model_name='invite',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 41, 960438), null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='atime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 42, 14987), null=True),
        ),
        migrations.AlterField(
            model_name='ownership',
            name='due',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 27, 41, 972284), null=True),
        ),
    ]
