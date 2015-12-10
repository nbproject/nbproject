# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AnalyticsClick',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('control', models.CharField(max_length=30)),
                ('value', models.CharField(max_length=30)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AnalyticsVisit',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AssignmentGrade',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 948057))),
                ('grade', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AssignmentGradeHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 948704))),
                ('grade', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('body', models.TextField(null=True, blank=True)),
                ('type', models.IntegerField(choices=[(1, b'Private'), (2, b'Staff'), (3, b'Class')])),
                ('signed', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('moderated', models.BooleanField(default=False)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CommentLabel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 950598))),
                ('grade', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CommentLabelHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 951232))),
                ('grade', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CommentSeen',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('comment', models.ForeignKey(to='base.Comment')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DefaultSetting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=1023)),
                ('description', models.TextField(null=True, blank=True)),
                ('value', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Ensemble',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(default=b'No description available', max_length=255)),
                ('allow_staffonly', models.BooleanField(default=True, verbose_name=b"Allow users to write 'staff-only' comments")),
                ('allow_anonymous', models.BooleanField(default=True, verbose_name=b'Allow users to write anonymous comments')),
                ('allow_guest', models.BooleanField(default=False, verbose_name=b'Allow guests (i.e. non-members) to access the site')),
                ('invitekey', models.CharField(max_length=63, null=True, blank=True)),
                ('use_invitekey', models.BooleanField(default=True, verbose_name=b"Allow users who have the 'subscribe link' to register by themselves")),
                ('allow_download', models.BooleanField(default=True, verbose_name=b'Allow users to download the PDFs')),
                ('allow_ondemand', models.BooleanField(default=False, verbose_name=b'Allow users to add any PDF accessible on the internet by pointing to its URL')),
                ('section_assignment', models.IntegerField(default=1, null=True, choices=[(1, b'NULL'), (2, b'RANDOM')])),
                ('metadata', models.TextField(null=True, blank=True)),
            ],
            options={
                'ordering': ['id'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='FileDownload',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 945809))),
                ('annotated', models.BooleanField(default=False)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
                ('parent', models.ForeignKey(to='base.Folder', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='GuestHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('t_start', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 946947), null=True)),
                ('t_end', models.DateTimeField(null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='GuestLoginHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 947517), null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HTML5Info',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.CharField(max_length=2048, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HTML5Location',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('path1', models.CharField(max_length=2048, null=True, blank=True)),
                ('path2', models.CharField(max_length=2048, null=True, blank=True)),
                ('offset1', models.IntegerField()),
                ('offset2', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Idle',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('t1', models.DateTimeField()),
                ('t2', models.DateTimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Invite',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('key', models.CharField(max_length=255)),
                ('admin', models.BooleanField(default=False)),
                ('ctime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 930217), null=True)),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='LabelCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('visibility', models.IntegerField(default=2, choices=[(1, b'USER'), (2, b'ADMIN'), (3, b'SUPERADMIN')])),
                ('scope', models.IntegerField(default=1, choices=[(1, b'COMMENT'), (2, b'THREAD')])),
                ('pointscale', models.IntegerField()),
                ('name', models.CharField(max_length=1024)),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='LabelCategoryCaption',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('grade', models.IntegerField()),
                ('caption', models.CharField(max_length=127)),
                ('category', models.ForeignKey(to='base.LabelCategory')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Landing',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('ip', models.CharField(max_length=63, null=True, blank=True)),
                ('client', models.CharField(max_length=1023, null=True, blank=True)),
                ('referer', models.CharField(max_length=1023, null=True, blank=True)),
                ('path', models.CharField(max_length=1023, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('version', models.IntegerField(default=1)),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('w', models.IntegerField()),
                ('h', models.IntegerField()),
                ('page', models.IntegerField()),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Mark',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.IntegerField(choices=[(1, b'answerplease'), (3, b'approve'), (5, b'reject'), (7, b'favorite'), (9, b'hide')])),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('comment', models.ForeignKey(to='base.Comment')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('admin', models.BooleanField(default=False)),
                ('deleted', models.BooleanField(default=False)),
                ('guest', models.BooleanField(default=False)),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=127)),
                ('atime', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 946494), null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='OnDemandInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.CharField(max_length=2048, null=True, blank=True)),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Ownership',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('published', models.DateTimeField(default=datetime.datetime.now)),
                ('deleted', models.BooleanField(default=False)),
                ('assignment', models.BooleanField(default=False)),
                ('due', models.DateTimeField(default=datetime.datetime(2015, 7, 11, 17, 29, 24, 933728), null=True)),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
                ('folder', models.ForeignKey(to='base.Folder', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PageSeen',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('page', models.IntegerField()),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Processqueue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('submitted', models.DateTimeField(default=datetime.datetime.now)),
                ('started', models.DateTimeField(null=True)),
                ('completed', models.DateTimeField(null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReplyRating',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('status', models.IntegerField(choices=[(1, b'unresolved'), (2, b'resolved'), (3, b'thanks')])),
                ('comment', models.ForeignKey(to='base.Comment')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('ensemble', models.ForeignKey(to='base.Ensemble')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('lastactivity', models.DateTimeField(default=datetime.datetime.now, null=True)),
                ('ip', models.CharField(max_length=63, null=True, blank=True)),
                ('clienttime', models.DateTimeField(null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SettingLabel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.IntegerField()),
                ('label', models.TextField()),
                ('setting', models.ForeignKey(to='base.DefaultSetting')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(default=b'untitled', max_length=255)),
                ('numpages', models.IntegerField(default=0)),
                ('w', models.IntegerField(default=0)),
                ('h', models.IntegerField(default=0)),
                ('rotation', models.IntegerField(default=0)),
                ('version', models.IntegerField(default=0)),
                ('type', models.IntegerField(default=1, choices=[(1, b'PDF'), (2, b'YOUTUBE'), (3, b'HTML5VIDEO'), (4, b'HTML5')])),
                ('x0', models.IntegerField(default=0)),
                ('y0', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SourceVersion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(default=b'untitled', max_length=255)),
                ('numpages', models.IntegerField(default=0)),
                ('w', models.IntegerField(default=0)),
                ('h', models.IntegerField(default=0)),
                ('rotation', models.IntegerField(default=0)),
                ('version', models.IntegerField(default=0)),
                ('published', models.DateTimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ThreadMark',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.IntegerField(choices=[(1, b'question'), (2, b'star'), (3, b'summarize')])),
                ('active', models.BooleanField(default=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('comment', models.ForeignKey(to='base.Comment', null=True)),
                ('location', models.ForeignKey(to='base.Location')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ThreadMarkHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.IntegerField(choices=[(1, b'question'), (2, b'star'), (3, b'summarize')])),
                ('active', models.BooleanField(default=True)),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('comment', models.ForeignKey(to='base.Comment', null=True)),
                ('location', models.ForeignKey(to='base.Location')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.EmailField(unique=True, max_length=63)),
                ('firstname', models.CharField(max_length=63, null=True, blank=True)),
                ('lastname', models.CharField(max_length=63, null=True, blank=True)),
                ('pseudonym', models.CharField(max_length=63, null=True, blank=True)),
                ('password', models.CharField(max_length=63, null=True, blank=True)),
                ('salt', models.CharField(max_length=32, null=True)),
                ('saltedhash', models.CharField(max_length=128, null=True)),
                ('confkey', models.CharField(max_length=63, null=True, blank=True)),
                ('guest', models.BooleanField(default=False)),
                ('valid', models.BooleanField(default=False)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserSetting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.IntegerField()),
                ('ctime', models.DateTimeField(default=datetime.datetime.now)),
                ('setting', models.ForeignKey(to='base.DefaultSetting')),
                ('user', models.ForeignKey(to='base.User')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='YoutubeInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('key', models.CharField(max_length=255, null=True, blank=True)),
                ('source', models.OneToOneField(to='base.Source')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='threadmarkhistory',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='threadmark',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='sourceversion',
            name='submittedby',
            field=models.ForeignKey(blank=True, to='base.User', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='source',
            name='submittedby',
            field=models.ForeignKey(blank=True, to='base.User', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='session',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='replyrating',
            name='threadmark',
            field=models.ForeignKey(to='base.ThreadMark'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='processqueue',
            name='source',
            field=models.ForeignKey(to='base.Source', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pageseen',
            name='session',
            field=models.ForeignKey(to='base.Session', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pageseen',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pageseen',
            name='user',
            field=models.ForeignKey(to='base.User', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='ownership',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='ondemandinfo',
            name='source',
            field=models.OneToOneField(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='membership',
            name='section',
            field=models.ForeignKey(to='base.Section', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='membership',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='mark',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='location',
            name='section',
            field=models.ForeignKey(to='base.Section', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='location',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='landing',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='invite',
            name='section',
            field=models.ForeignKey(to='base.Section', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='invite',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='idle',
            name='session',
            field=models.ForeignKey(to='base.Session'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='html5location',
            name='location',
            field=models.OneToOneField(to='base.Location'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='html5info',
            name='source',
            field=models.OneToOneField(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guestloginhistory',
            name='guest',
            field=models.ForeignKey(related_name=b'u1', to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guestloginhistory',
            name='user',
            field=models.ForeignKey(related_name=b'u2', to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guesthistory',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='filedownload',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='filedownload',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentseen',
            name='session',
            field=models.ForeignKey(to='base.Session', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentseen',
            name='user',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentlabelhistory',
            name='category',
            field=models.ForeignKey(to='base.LabelCategory'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentlabelhistory',
            name='comment',
            field=models.ForeignKey(to='base.Comment'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentlabelhistory',
            name='grader',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentlabel',
            name='category',
            field=models.ForeignKey(to='base.LabelCategory'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentlabel',
            name='comment',
            field=models.ForeignKey(to='base.Comment'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='commentlabel',
            name='grader',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='comment',
            name='location',
            field=models.ForeignKey(to='base.Location'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='comment',
            name='parent',
            field=models.ForeignKey(to='base.Comment', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assignmentgradehistory',
            name='grader',
            field=models.ForeignKey(related_name=b'g_grade_h', to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assignmentgradehistory',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assignmentgradehistory',
            name='user',
            field=models.ForeignKey(related_name=b'u_grade_h', to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assignmentgrade',
            name='grader',
            field=models.ForeignKey(related_name=b'g_grade', to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assignmentgrade',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assignmentgrade',
            name='user',
            field=models.ForeignKey(related_name=b'u_grade', to='base.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='analyticsvisit',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='analyticsvisit',
            name='user',
            field=models.ForeignKey(to='base.User', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='analyticsclick',
            name='source',
            field=models.ForeignKey(to='base.Source'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='analyticsclick',
            name='user',
            field=models.ForeignKey(to='base.User', null=True),
            preserve_default=True,
        ),
    ]
