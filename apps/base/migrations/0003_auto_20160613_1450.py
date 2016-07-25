# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_auto_20160101_0052'),
    ]

    operations = [
        migrations.AddField(
            model_name='ensemble',
            name='default_pause',
            field=models.BooleanField(default=False, verbose_name=b'Pause on staff Video comments by default'),
        ),
        migrations.AddField(
            model_name='location',
            name='pause',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='assignmentgrade',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 130604)),
        ),
        migrations.AlterField(
            model_name='assignmentgradehistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 131244)),
        ),
        migrations.AlterField(
            model_name='commentlabel',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 133046)),
        ),
        migrations.AlterField(
            model_name='commentlabelhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 133671)),
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 128230)),
        ),
        migrations.AlterField(
            model_name='guesthistory',
            name='t_start',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 129539), null=True),
        ),
        migrations.AlterField(
            model_name='guestloginhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 130061), null=True),
        ),
        migrations.AlterField(
            model_name='invite',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 105361), null=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='atime',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 129090), null=True),
        ),
        migrations.AlterField(
            model_name='ownership',
            name='due',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 13, 14, 50, 35, 110790), null=True),
        ),
    ]
