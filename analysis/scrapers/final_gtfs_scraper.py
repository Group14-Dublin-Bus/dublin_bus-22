import pandas as pd
# import sqlite3
import sqlalchemy as sqla
from sqlalchemy import create_engine
import pymysql
# import mysql
# import requests
import urllib.request
import json
# import time
# from datetime import datetime


USER = 'group14'
PASSWORD = 'gRouP1422'
URL = 'database-dublin-bus.cnhytboldqes.eu-west-1.rds.amazonaws.com'
PORT = '3306'
DB = "database-dublin-bus"
engine = create_engine(
    "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
engine = create_engine(
    "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

engine.execute("""CREATE TABLE if not exists gtfsr(
             Time_of_db_update VARCHAR(256),
             TripId VARCHAR(256),
             RouteId VARCHAR(256),
             StartTime VARCHAR(256),
             StartDate VARCHAR(256),
             StopSequence VARCHAR(256),
             StopId VARCHAR(256),
             Arr_delay VARCHAR(256),
             Dep_delay VARCHAR(256))
             """)

db = pymysql.connect(
    host=URL,
    user=USER,
    password=PASSWORD,
    port=3306,
    database=DB)
#current_time = now.strftime("%H:%M")

url = "https://api.nationaltransport.ie/gtfsr/v1?format=json"

hdr = {
    'Cache-Control': 'no-cache',
    'x-api-key': 'd01bfcfc5bdf41fe82eddd91ca1dd3e1'
}

req = urllib.request.Request(url, headers=hdr)
req.get_method = lambda: 'GET'
response = urllib.request.urlopen(req)
print(response.getcode())
f = (response.read())
jsonResponse = json.loads(f.decode('utf-8'))
# print("h",len(jsonResponse['Entity']))


for x in jsonResponse["Entity"]:
    if "StopTimeUpdate" in x["TripUpdate"]:
        # print("ent")
        for i in x["TripUpdate"]["StopTimeUpdate"]:
         #      print("i")
            if "Arrival" in i and "Departure" in i:
               # print("YIPPPEEE")
                if "Delay" in i["Arrival"] and "Delay" in i["Departure"]:

                   # ff=ff+1

                    # for i in x["TripUpdate"]["StopTimeUpdate"]:

                    print("i")

                    gt = (
                        str(jsonResponse["Header"]["Timestamp"]),
                        str(x["TripUpdate"]["Trip"]["TripId"]),
                        str(x["TripUpdate"]["Trip"]["StartTime"]),
                        str(x["TripUpdate"]["Trip"]["StartDate"]),
                        str(x["TripUpdate"]["Trip"]["RouteId"]),
                        # print("yes",str(x["TripUpdate"]["Trip"]["RouteId"]),
                        str(i["StopSequence"]),
                        str(i["StopId"]),
                        str(i["Arrival"]["Delay"]),
                        str(i["Departure"]["Delay"]))

                   # )
                   # str(i["StopSequence"]),
                   # str(i["StopId"])
               #   if "Arrival" in x:
                   # arr=""
               # arr=str(i["Arrival"]["Delay"])
                #  if "Departure" in x:
               # dep=""
               # dep=str(i["Departure"]["Delay"])

                    gtfs = gt
                    # print(len(gtfs))

                    print("INSERTING")
                    ins = ("INSERT INTO gtfsr(Time_of_db_update,TripId,StartTime,StartDate,RouteId,StopSequence,StopId,Arr_delay,Dep_delay)"
                           "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)")
                    engine.execute(ins, gtfs)
                    print("XXXXXXXXXXXXXX", gtfs)
                    # TripId VARCHAR(256),

                    # cursor.execute(sql1)
                    # engine.execute(sql1)
                    db.commit()
                    print("Insert successfully")

                   # db.close()

               # print(ff)
                   # return (gtfs)
