import json, re

INPUT_FILES = ["HarvardX-HLS1xB-Copyright.mongo"]

def process_file (filename): 
    f = open(filename)
    s = f.read()
    s = "["+s[:-1]+"]"
    s = re.sub("\n{", ",{", s)
    f.close()
    o= json.loads(s)
    
    #First courses: 
    courses = set((obj["course_id"] for obj in o if obj["_type"]=="CommentThread"))
    for x in courses: 
        if len(M.Course.object.filter(name=x))==0:
            m = M.Course()
            m.name = x
            m.save()

    #Then Authors: 
    author_ids = set((int(obj["author_id"]) for obj in o))
    for x in author_id: 
        if len(M.Author.object.filter(edxid=x))==0:
            m = M.Author()
            m.edxid = x
            m.save()

    #Now threads: 
    threads = (obj["course_id"] for obj in o if obj["_type"]=="CommentThread")
    for thread in threads: 
        m = M.CommentThread()
        m.oid = thread["_id"]["$oid"]
        m.title = thread["title"]
        m.course = M.Course.object.filter(name=thread["course_id"])[0]
        m.save()
        #initial comment: 
        c = M.Comment()
        c.anonymous = thread["anonymous"]
        c.anonymous_to_peers = thread["anonymous_to_peers"]
        #SACHA CONTINUE HERE
        c.author = M.Author.object.filter(edxid=)


if __name__ == "__main__": 
    for filename in INPUT_FILES: 
        process_file(filename)
