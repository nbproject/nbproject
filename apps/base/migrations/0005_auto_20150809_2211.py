# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_auto_20150802_1734'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='is_title',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assignmentgrade',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 673845)),
        ),
        migrations.AlterField(
            model_name='assignmentgradehistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 676124)),
        ),
        migrations.AlterField(
            model_name='commentlabel',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 681360)),
        ),
        migrations.AlterField(
            model_name='commentlabelhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 683466)),
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 666993)),
        ),
        migrations.AlterField(
            model_name='guesthistory',
            name='t_start',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 670551), null=True),
        ),
        migrations.AlterField(
            model_name='guestloginhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 672136), null=True),
        ),
        migrations.AlterField(
            model_name='invite',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 616431), null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='atime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 669049), null=True),
        ),
        migrations.AlterField(
            model_name='ownership',
            name='due',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 9, 22, 11, 11, 627299), null=True),
        ),
    ]
