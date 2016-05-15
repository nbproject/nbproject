"""
db.py -  Database utilities

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""
import datetime, os,  re, json, logging 
from django.db import connection, transaction

#if "DJANGO_SETTINGS_MODULE" not in os.environ: 
#    os.environ['DJANGO_SETTINGS_MODULE'] = 'servers.settings'
from django.conf import settings

class Db: 
    def __init__(self, dbconf=None):
        if dbconf is None:
            dbconf = "default"
        self.dbconf = dbconf
        self.parms = settings.DATABASES[dbconf]
        self.conn = None
    
    def connectMaybe(self): 
        if self.conn is not None: 
            return
        return connection

    def getNewConnection(self):
        return connection

    def escape_string(self, s):
        return connection.ops.quote_name(s)

    def execute(self, qry, args, connection=None):
        cursor = None
        if connection is None: 
            self.connectMaybe()
            cursor = self.conn.cursor()
        else:
            cursor = connection.cursor()
        #replace placeholder if in postgres mode
        if self.parms["ENGINE"] == "django.db.backends.postgresql_psycopg2":
            qry=    qry.replace("?", "%s")
        if settings.DEBUG_QUERY: 
            logging.info("[execute] "+ qry % args)
        cursor.execute(qry, args)
        return cursor
   
    def doTransaction(self, qry, args):
        connection = self.getNewConnection()
        cursor = self.execute(qry, args, connection)
        transaction.commit_unless_managed()

    def getIndexedRows(self, qry, args): #same as getRows but returns the results in a dict index by the 1st val
        rows = self.getRows(qry, args)
        x = None if rows is None else {}
        for row in rows:
            if row[0] in x:
                x[row[0]].append(row)
            else:
                x[row[0]]=[row]
        return x

    def getVal(self, qry, args):
        connection = self.getNewConnection()
        cursor = self.execute(qry, args, connection)
        row = cursor.fetchone()
        cursor.close()
        if row is None:
            return None
        return row[0]

    def getRow(self, qry, args):
        connection = self.getNewConnection()
        cursor = self.execute(qry, args, connection)
        row = cursor.fetchone()
        cursor.close()
        return row

    def getRows(self, qry, args):
        if settings.DEBUG_QUERY: 
            debug_query = qry.replace("?", "%s")
            logging.info("[getRows] "+ debug_query % args)
        connection = self.getNewConnection()
        cursor = self.execute(qry, args, connection)
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def getRowsByName(self, c, names, container):
        #c: a database cursor, on which a sql query has bveen carried out
        #names: A mapping: id_desired -> SQL fieldname (SQL fieldname can be None if we want same as id_desired)

        #build dict: 
        d = {}
        for i in xrange(0, len(c.description)):
            d[c.description[i][0]] = i
        rows = c.fetchall()
        for r in rows:
            a = {}
            for n in names:
                sqlfield = n if names[n] is None else names[n]
                a[n] = r[d[sqlfield]]
            container.append(a)
        return d,rows

    def getIndexedObjects(self, names, indexName,  fromclause, whereclause, args, extraSQL=""):
        #names: A mapping: id_desired -> SQL fieldname (SQL fieldname can be None if we want same as id_desired)
        #indexName: name of the json (not sql) field we want to use as the index 
        #   CAUTION: if several rows returned the same value for indexName, only one will be returned.
        #            This can be sometimes a feature (sort of "distinct")
        #extraSQL: stuff like order by, group by... sql clauses (i.e that should go after the whereclause
        container = {}
        d={}
        selectclause = ""    
        for n in names: 
            selectclause += " %s,"%(n if names[n] is None else names[n],)
        selectclause=selectclause[:-1] #remove trailing comma
        qry = "select %s from %s where %s %s"%(selectclause, fromclause, whereclause, extraSQL)
        if settings.DEBUG_QUERY:
            debug_query = qry.replace("?", "%s")
            logging.info("[getIndexedObjects] "+ debug_query % args)
        connection = self.getNewConnection()
        c = self.execute(qry, args, connection)
        for i in xrange(0, len(c.description)):
            d[c.description[i][0]] = i
        rows = c.fetchall()
        for r in rows:
            a = {}
            for n in names:
                sqlfield = n if names[n] is None else names[n]
                if " as " in sqlfield:
                    sqlfield = sqlfield.rpartition(" as ")[2].strip()
                a[n] = r[d[sqlfield]]
            container[a[indexName]] = a
        return container
