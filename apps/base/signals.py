"""
signals.py - custom signals

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""
from django.dispatch import Signal

register_session    = Signal(providing_args=["payload"])
page_served         = Signal(providing_args=["payload"])
file_downloaded     = Signal(providing_args=["payload"])
