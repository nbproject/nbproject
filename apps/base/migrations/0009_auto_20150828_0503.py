# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_auto_20150818_2327'),
    ]

    operations = [
        migrations.AddField(
            model_name='ensemble',
            name='allow_tag_private',
            field=models.BooleanField(default=True, verbose_name=b'Allow users to make comments private to tagged users only'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assignmentgrade',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 379350)),
        ),
        migrations.AlterField(
            model_name='assignmentgradehistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 381711)),
        ),
        migrations.AlterField(
            model_name='commentlabel',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 386967)),
        ),
        migrations.AlterField(
            model_name='commentlabelhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 388940)),
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 372647)),
        ),
        migrations.AlterField(
            model_name='guesthistory',
            name='t_start',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 375994), null=True),
        ),
        migrations.AlterField(
            model_name='guestloginhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 377586), null=True),
        ),
        migrations.AlterField(
            model_name='invite',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 320131), null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='atime',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 374637), null=True),
        ),
        migrations.AlterField(
            model_name='ownership',
            name='due',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 28, 5, 3, 22, 331803), null=True),
        ),
    ]
