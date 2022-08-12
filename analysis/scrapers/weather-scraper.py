from requests import exceptions
from sqlalchemy import create_engine, Table, Column, Integer, String, Numeric, DateTime, MetaData
import requests
import datetime
import time


# def table_builder(json_list):
def table_builder(json_list, rain_list):

    # Import DB credentials from txt file
    f = open('credentials.txt')
    
    credentials_string = f.read()
    credentials_list = credentials_string.split()
    f.close()

    db_user = credentials_list[0]
    db_name = credentials_list[1]
    db_password = credentials_list[2]
    db_end = credentials_list[3]

    # Creat SQLAlchemy engine (Echo provides sqlalchemy logging)
    engine = create_engine(
        "mysql+pymysql://{0}:{1}@{2}/{3}".format(
            db_user, db_password, db_end, db_name),
        echo=False)

    # Define the table object using the API data
    metadata_obj = MetaData()
    weather = Table("weather", metadata_obj,
                    Column("request_time", DateTime, primary_key=True),
                    Column("temp", Integer),
                    Column("wind_speed", Integer),
                    Column("rain", Numeric),
                    Column("wind_gust", String(60)),
                    Column("weather_main", String(60)),
                    )

    # Create the table if it does not already exist
    metadata_obj.create_all(engine)

    # Get index to return
    packages_json = json_list
    rain_json = rain_list

    list_index = -1
    while list_index < 0:
        if (len(rain_json) - 1) < 0 or (len(rain_json) - 1) > 23:
            time.sleep(300)
        else:
            list_index = len(rain_json) - 1

    # Store the JSON data in Variables
    rain = rain_json[list_index]["rainfall"]
    temp = packages_json["list"][0]["main"]["temp"]
    wind_speed = packages_json["list"][0]["wind"]["speed"]
    wind_gust = packages_json["list"][0]["wind"]["gust"]
    weather_main = packages_json["list"][0]["weather"][0]["main"]
    request_time = datetime.datetime.now()

    # Insert a new row of data from the API
    conn = engine.connect()
    ins = weather.insert()
    # conn.execute(ins,
    #              {"request_time": request_time, "temp": temp, "wind_speed": wind_speed,
    #                "wind_gust": wind_gust, "weather_main": weather_main, })

    conn.execute(ins,
                 {"request_time": request_time, "temp": temp, "wind_speed": wind_speed, "rain": rain,
                  "wind_gust": wind_gust, "weather_main": weather_main, })


def main():
    count = 0

    # Periodically call the OpenWeather and MetEireann API and pass the JSON data to the table_builder function
    while count < 1:
        try:
            api_key = 'cb83157b692116c3c619955304037718'
            lat = 53.350140
            lon = -6.266155
            url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"

            r1 = requests.get(
                url, timeout=20)
            json_data = r1.json()

            r2 = requests.get(
                "https://prodapi.metweb.ie/observations/phoenix-park/today", timeout=20)
            rain_list = r2.json()

            # table_builder(json_data)
            table_builder(json_data, rain_list)
            count = + 1

        # Exception Handling for API connection, run again with reduced timer if unsuccessful
        # Source stackoverflow
        except exceptions.HTTPError as errh:
            print("Http Error:", errh)
            time.sleep(180)
        except exceptions.ConnectionError as errc:
            print("Error Connecting:", errc)
            time.sleep(180)
        except exceptions.Timeout as errt:
            print("Timeout Error:", errt)
            time.sleep(180)
        except exceptions.RequestException as err:
            print("OOps: Something Else", err)
            time.sleep(180)


if __name__ == "__main__":
    main()
