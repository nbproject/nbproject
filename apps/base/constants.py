"""
constants.py -  Values for constants

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""

COMMENTS_VISIBILITY = { 1: "Myself", 
          2:"Staff", 
          3:"Class", 
          4:"(deprecated)"}


MARK_TYPES = {
    "answerplease" : 1, 
    "approve": 3, 
    "reject": 5, 
    "favorite": 7, 
    "hide": 9
    }

PRIVILEGES = {
    "STATS_ADMIN": 1,
}

RESOLUTIONS =  {"72":{"20": None, "100": None},"288":{"25": None, "33": None, "50": None, "65": None, "80": None, "100": None }}

RESOLUTION_COORDINATES =  150
