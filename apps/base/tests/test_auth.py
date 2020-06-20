"""
test_auth.py

Note that Django 1.3 uses Python 2.7 unittest syntax, even when running in Python 2.6

Author 
    Peter Wilkins <pwilkins@mit.edu>
    Sacha Zyto <sacha@csail.mit.edu>
    
License
    Copyright (c) 2011 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
    
$ Id: $    
"""
from django.test import TestCase
from apps.base import auth

class TestConfirmInvite(TestCase):
    fixtures = ['Membership', 'Invite', ]

    def test_confirm_invite(self):
        # self.assertEqual(expected, confirmInvite(id))
#        assert False # TODO: implement your test here
        self.assertEqual(auth.confirmInvite('617-555-1212'), None)
        
        invite = auth.confirmInvite('hQFyCu91Z1Lj1tdarrG3eUkbLcHuktnM4FurHiXV7m7wdOwJPf')
        self.assertEqual(invite.id, 3214) 

class TestInvite2uid(TestCase):
    fixtures = ['Invite', 'User', ]
    
    def test_invite2uid(self):
        self.assertEqual(None, auth.invite2uid(None), 'invite2uid() != None')
        self.assertEqual(1216, auth.invite2uid('hQFyCu91Z1Lj1tdarrG3eUkbLcHuktnM4FurHiXV7m7wdOwJPf'))
        

class TestCanReadFile(TestCase):
    fixtures = ['Folder', 'Processqueue', 'Membership', 'Ensemble', 'Ownership', 'Invite', 'User', ]
    
    def test_can_read_file(self):
        self.assertTrue(auth.canReadFile(1216, 750))


class TestCanGuestReadFile(TestCase):
    fixtures = ['Folder', 'Processqueue', 'Membership', 'Ensemble', 'Ownership', 'Invite', 'User', ]
    def test_can_guest_read_file(self):
        # TODO: canGuestReadFile() is unimplemented
        self.assertFalse(auth.canGuestReadFile('unimplemented'), 'canGuestReadFile() is unimplemented')

class TestCanAnnotate(TestCase):
    fixtures = ['Folder', 'Processqueue', 'Membership', 'Ensemble', 'Ownership', 'Invite', 'User', ]
        
    def test_can_annotate(self):
        # self.assertEqual(expected, canAnnotate(uid, eid))
        self.assertTrue(auth.canAnnotate(1216, 1311))

