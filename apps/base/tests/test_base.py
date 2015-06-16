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
from django.test import LiveServerTestCase
from selenium.common.exceptions import NoSuchElementException
from base.models import User, Ensemble, Source
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.firefox.webdriver import WebDriver

class TestVisitWelcomePage(LiveServerTestCase): 
    """Tests the welcome page"""
    fixtures = ["users.json"]

    @classmethod
    def setUpClass(cls):
        cls.driver = WebDriver()
        cls.bycss = cls.driver.find_element_by_css_selector        
        super(TestVisitWelcomePage, cls).setUpClass()

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        super(TestVisitWelcomePage, cls).tearDownClass()

    def test_welcome(self):
        """
        I should be able to log in as the first user. 
        Once I've logged in, I should be able to go to the welcome page and try and login as the second user. 
        """
        welcome_url = '%s%s' % (self.live_server_url, '/welcome')
        self.driver.get(welcome_url)
        css_selector_email="input#login_user_email"
        css_selector_password="input#login_user_password"
        css_selector_submit="button#auth_submit"
        css_selector_loginname="a#login-name"               
        def try_to_login(user): 
            self.bycss(css_selector_email).send_keys(user.email)
            self.bycss(css_selector_password).send_keys(user.password)
            self.bycss(css_selector_submit).click()
            element = WebDriverWait(self.driver, 10).until(lambda x: x.find_element_by_css_selector(css_selector_loginname))
            self.assertEqual(element.text, "%s %s" % (user.firstname, user.lastname), "user name didn't match")
        try_to_login(User.objects.all().order_by("id")[0]) #try to login as first user. 
        self.driver.get(welcome_url) 
        try_to_login(User.objects.all().order_by("id")[1]) #now try and re-login as second user :
        
        
        
class TestVisitDesktopPage(LiveServerTestCase): 
    """Tests the desktop page"""
    fixtures = ["users.json", "source1.json"]

    @classmethod
    def setUpClass(cls):
        cls.driver = WebDriver()
        cls.bycss = cls.driver.find_element_by_css_selector        
        super(TestVisitDesktopPage, cls).setUpClass()

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        super(TestVisitDesktopPage, cls).tearDownClass()

    def test_see_group(self):
        """
        I should be able to log in as the first user. 
        I should be able to see one group. 
        When clicking on that group, I should be able to see 1 file for thar group.   
        """
        welcome_url = '%s%s' % (self.live_server_url, '/welcome')        
        self.driver.get(welcome_url)
        css_selector_email="input#login_user_email"
        css_selector_password="input#login_user_password"
        css_selector_submit="button#auth_submit"
        css_selector_loginname="a#login-name"               
        def try_to_login(user): 
            self.bycss(css_selector_email).send_keys(user.email)
            self.bycss(css_selector_password).send_keys(user.password)
            self.bycss(css_selector_submit).click()
            element = WebDriverWait(self.driver, 10).until(lambda x: x.find_element_by_css_selector(css_selector_loginname))
            self.assertEqual(element.text, "%s %s" % (user.firstname, user.lastname), "user name didn't match")
        try_to_login(User.objects.all().order_by("id")[0]) #try to login as first user. 
        self.driver.get(self.live_server_url)         
        a = self.bycss(".jstree-leaf[rel=ensemble][id_item='1']")
        ensemble_name=Ensemble.objects.get(pk=1).name
        self.assertEqual(a.text, ensemble_name, "ensemble name didn't match")
        #now try and click the link:
        a2 = a.find_element_by_tag_name("a")
        a2.click()
        file_elt = WebDriverWait(self.driver, 3).until(lambda x: x.find_element_by_css_selector(".filesview_ftitle>a"))        
        self.assertEqual(file_elt.text, Source.objects.get(pk=1).title, "source title didn't match")
        file_elt.click()
        #check for instance that NB.pers.store.o.file[1].title is the same title
        pass
 
# >>> d = WebDriver()
#>>> d.get("http://nb.mit.edu")
#>>> 
#
#
#from selenium.webdriver.common.action_chains import ActionChains
#>>> a = ActionChains(d)
#>>> s = d.find_element_by_class_name("selected")
#>>> a.move_to_element_with_offset(s, 100, 50).click_and_hold(None).move_to_element_with_offset(s, 300, 200).release(None).perform()
    

#from apps.base import auth
#
#class TestConfirmInvite(TestCase):
#    fixtures = ['Membership', 'Invite', ]
#
#    def test_confirm_invite(self):
#        # self.assertEqual(expected, confirmInvite(id))
#        assert False # TODO: implement your test here
#        self.failUnlessEqual(auth.confirmInvite('617-555-1212'), None)
#        
#        invite = auth.confirmInvite('hQFyCu91Z1Lj1tdarrG3eUkbLcHuktnM4FurHiXV7m7wdOwJPf')
#        self.failUnlessEqual(invite.id, 3214) 
#
#class TestInvite2uid(TestCase):
#    fixtures = ['Invite', 'User', ]
#    
#    def test_invite2uid(self):
#        self.assertEqual(None, auth.invite2uid(None), 'invite2uid() != None')
#        self.assertEqual(1216, auth.invite2uid('hQFyCu91Z1Lj1tdarrG3eUkbLcHuktnM4FurHiXV7m7wdOwJPf'))
#        
#
#class TestCanReadFile(TestCase):
#    fixtures = ['Folder', 'Processqueue', 'Membership', 'Ensemble', 'Ownership', 'Invite', 'User', ]
#    
#    def test_can_read_file(self):
#        self.assertTrue(auth.canReadFile(1216, 750))
#
#
#class TestCanGuestReadFile(TestCase):
#    fixtures = ['Folder', 'Processqueue', 'Membership', 'Ensemble', 'Ownership', 'Invite', 'User', ]
#    def test_can_guest_read_file(self):
#        # TODO: canGuestReadFile() is unimplemented
#        self.assertFalse(auth.canGuestReadFile('unimplemented'), 'canGuestReadFile() is unimplemented')
#
#class TestCanAnnotate(TestCase):
#    fixtures = ['Folder', 'Processqueue', 'Membership', 'Ensemble', 'Ownership', 'Invite', 'User', ]
#        
#    def test_can_annotate(self):
#        # self.assertEqual(expected, canAnnotate(uid, eid))
#        self.assertTrue(auth.canAnnotate(1216, 1311))
#


