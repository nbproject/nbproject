"""
utils.py - Miscellaneous utils

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""
import sys

def process_cli(cmdname, ACTIONS):
    """ACTIONS should be a dict action name -> function ptrs"""
    if len(sys.argv) < 2  or sys.argv[1] not in ACTIONS:
        print "\n%s\nUSAGE: '%s action', where action in the following:\n" % ("-"*104,cmdname )
        description = ["%-20s  %-30s  %s" % ("Action", "Function", "Description"), 
                       "%-20s  %-30s  %s" % ("-"*20, "-"*30, "-"*50)
                       ]       
        for (k,v) in ACTIONS.iteritems():
            description.append("%-20s  %-30s  %s" % (k, v.__name__, v.__doc__))
        print "\n".join(description)
        print "%s\n" % ("-"*104, )

    else:
        ACTIONS[sys.argv[1]](tuple(sys.argv[2:]))
        #ACTIONS[sys.argv[1]]()


    

