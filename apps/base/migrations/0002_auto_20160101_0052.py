# -*- coding: utf-8 -*-


from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.IntegerField(choices=[(1, b'Individual')])),
                ('last_reminder', models.DateTimeField(null=True)),
                ('comment', models.ForeignKey(to='base.Comment', on_delete=models.CASCADE)),
                ('individual', models.ForeignKey(to='base.User', null=True, on_delete=models.SET_NULL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='ensemble',
            name='allow_tag_private',
            field=models.BooleanField(default=True, verbose_name=b'Allow users to make comments private to tagged users only'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='location',
            name='duration',
            field=models.IntegerField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='location',
            name='is_title',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assignmentgrade',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 282232)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assignmentgradehistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 284790)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='comment',
            name='type',
            field=models.IntegerField(choices=[(1, b'Private'), (2, b'Staff'), (3, b'Class'), (4, b'Tag Private')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='commentlabel',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 290794)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='commentlabelhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 293080)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='annotated',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='filedownload',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 274556)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='guesthistory',
            name='t_start',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 278246), null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='guestloginhistory',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 280178), null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='invite',
            name='ctime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 214499), null=True, db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='notification',
            name='atime',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 276723), null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='ownership',
            name='due',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 1, 0, 52, 52, 227715), null=True),
            preserve_default=True,
        ),
    ]
