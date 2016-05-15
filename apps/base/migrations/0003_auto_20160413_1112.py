# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
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
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='location',
            name='pause',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assignmentgrade',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 729813)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assignmentgradehistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 730457)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='commentlabel',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 732230)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='commentlabelhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 732972)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 727445)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='guesthistory',
            name='t_start',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 728448), null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='guestloginhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 729136), null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='invite',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 706164), null=True, db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='notification',
            name='atime',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 728040), null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='ownership',
            name='due',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 13, 11, 12, 26, 712869), null=True),
            preserve_default=True,
        ),
    ]
