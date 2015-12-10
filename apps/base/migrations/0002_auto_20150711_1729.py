# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignmentgrade',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 308301)),
        ),
        migrations.AlterField(
            model_name='assignmentgradehistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 309638)),
        ),
        migrations.AlterField(
            model_name='commentlabel',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 313497)),
        ),
        migrations.AlterField(
            model_name='commentlabelhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 314922)),
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 303706)),
        ),
        migrations.AlterField(
            model_name='guesthistory',
            name='t_start',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 305979), null=True),
        ),
        migrations.AlterField(
            model_name='guestloginhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 307198), null=True),
        ),
        migrations.AlterField(
            model_name='invite',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 269420), null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='atime',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 305036), null=True),
        ),
        migrations.AlterField(
            model_name='ownership',
            name='due',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 54, 277348), null=True),
        ),
    ]
