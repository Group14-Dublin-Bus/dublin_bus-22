import pandas as pd
import pickle
import math
from os import path

from pymongo import MongoClient
from rest_framework import generics, status
from .serializers import ReportSerializer, CreateReportSerializer, FavouriteSerializer, CreateFavouriteSerializer, CreateFeedbackSerializer, FeedbackSerializer
from .models import Report, Favourite, Feedback
from django.http import JsonResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.views.decorators.csrf import csrf_exempt

import json

import warnings
warnings.filterwarnings("ignore")


class ReportView(generics.ListAPIView):
    # View to test report feature
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


class GetReport(APIView):
    # View to return reports, used in alerts feature to view the 10 most recently updated user reports
    serializer_class = ReportSerializer

    def get(self, request, format=None):
        reports = Report.objects.order_by('updated_at')[:10]
        if len(reports) > 0:
            data = ReportSerializer(reports, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response({"Bad request": "No reports"}, status=status.HTTP_404_NOT_FOUND)


class CreateReportView(APIView):
    # View to create new user reports on bus service updates, only one report per user session so update if they submit subsequent reports
    serializer_class = CreateReportSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            host = self.request.session.session_key
            submission_type = serializer.data.get("submission_type")
            route = serializer.data.get("route")
            travel_time = serializer.data.get("travel_time")
            delay = serializer.data.get("delay")
            text = serializer.data.get("text")
            queryset = Report.objects.filter(host=host)
            if queryset.exists():
                user = queryset[0]
                user.submission_type = submission_type
                user.route = route
                user.travel_time = travel_time
                user.delay = delay
                user.text = text
                user.save(update_fields=[
                          "submission_type", "route", "travel_time", "delay", "text", "updated_at"])
                return Response(ReportSerializer(user).data, status=status.HTTP_200_OK)
            else:
                user = Report(host=host, submission_type=submission_type,
                              route=route, travel_time=travel_time, delay=delay, text=text)
                user.save()

            return Response(ReportSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data submitted'}, status=status.HTTP_400_BAD_REQUEST)


class FeedbackView(generics.ListAPIView):
    # View to test feedback feature
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer


class CreateFeedbackView(APIView):
    # View to create new user feedback on the website, only one submission per users session so update if they submit subsequent submissions
    serializer_class = CreateFeedbackSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            host = self.request.session.session_key
            feedback_type = serializer.data.get("feedback_type")
            os = serializer.data.get("os")
            text = serializer.data.get("text")
            queryset = Feedback.objects.filter(host=host)
            if queryset.exists():
                user = queryset[0]
                user.feedback_type = feedback_type
                user.os = os
                user.text = text
                user.save(update_fields=[
                          "feedback_type", "os", "text", "updated_at"])
                return Response(FeedbackSerializer(user).data, status=status.HTTP_200_OK)
            else:
                user = Feedback(host=host, feedback_type=feedback_type,
                                os=os, text=text)
                user.save()

            return Response(FeedbackSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data submitted'}, status=status.HTTP_400_BAD_REQUEST)


class FavouriteView(generics.ListAPIView):
    # De-scoped: View to test report feature
    queryset = Favourite.objects.all()
    serializer_class = FavouriteSerializer


class GetFavourite(APIView):
    # De-scoped: View to return a users favourites based on their session key to display in the frontend
    serializer_class = FavouriteSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            favourite = Favourite.objects.filter(code=code)
            if len(favourite) > 0:
                data = FavouriteSerializer(favourite[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({"No Favourites Found": "Invalid Code"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad request": "Code Not Found"}, status=status.HTTP_400_BAD_REQUEST)


class CreateFavouriteView(APIView):
    # De-scoped: View to add suers favourites based on their session key and save or update in the model
    serializer_class = CreateFavouriteSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            host = self.request.session.session_key
            route = serializer.data.get("route")
            queryset = Favourite.objects.filter(host=host)
            if queryset.exists():
                user = queryset[0]
                user.route = route
                user.save(update_fields=["route"])
                return Response(FavouriteSerializer(user).data, status=status.HTTP_200_OK)
            else:
                user = Favourite(host=host, route=route)
                user.save()

            return Response(FavouriteSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data submitted'}, status=status.HTTP_400_BAD_REQUEST)


class FavouriteView(generics.ListAPIView):
    # De-scoped: View to test report feature
    queryset = Favourite.objects.all()
    serializer_class = FavouriteSerializer


class StopsView():
    # View to return stops data from mongo db collections for use in front end
    def stops(request):
        client = MongoClient(
            'mongodb+srv://Nalced7:Nalced997@cluster0.25zfifd.mongodb.net/?retryWrites=true&w=majority')
        db = client.Stops
        col = db.bus_stops
        cursor = col.find({}, {'_id': False})

        data = {}
        for count, value in enumerate(list(cursor)):
            data[count] = value

        client.close()
        return JsonResponse(data, safe=False)


class RoutesView():
    # View to return routes data from mongo db collections for use in front end
    def routes(request, route_number):
        print(route_number)
        modified_string = route_number.replace('_P10_', '(')
        modified_string = modified_string.replace('_P01_', ')')
        modified_string = modified_string.replace('_D01_', '-')
        modified_string = modified_string.replace('_Q01_', '\'')
        modified_string = modified_string.replace('_', ' ')

        print(modified_string)
        # take the route_number from url and fetch the according column
        client = MongoClient(
            'mongodb+srv://Nalced7:Nalced997@cluster0.25zfifd.mongodb.net/?retryWrites=true&w=majority')

        db = client['routex']
        col = db[modified_string]
        cursor = col.find({}, {'_id': False})

        data = {}
        for count, value in enumerate(list(cursor)):
            data[count] = value

        client.close()
        return JsonResponse(data, safe=False)


class WeatherView():
    # View to return weather data for dublin from OpenWeather API for use in front end
    def weather(request):
        api_key = 'cb83157b692116c3c619955304037718'
        lat = 53.350140
        lon = -6.266155
        # 5 day 3 hour forecast
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        response = requests.get(url)
        weather_data = response.json()

        # split the weather data by day instead of each 3 hour
        # So the size of list item in response become 6
        index = -1
        previous = ''
        result = []
        for list in weather_data['list']:
            current = list['dt_txt'].split()[0]
            if(previous != current):
                previous = current
                index += 1
                result.append({})
                result[index]['date'] = current
                result[index]['weather'] = []

            result[index]['weather'].append(list)

        weather_data['list'] = result

        return JsonResponse(weather_data, safe=False)


class LineNumberView():
    def line_number(request):
        # View to return list of routes based on mongo db collection names used in dropdowns in the front end
        route_names = ['14 - Outside Luas Station - Maryfield Drive', 'C6 Straffan Road - Barrow Street', '40 - Harristown Bus Garage - Monkstown Avenue (Richmond Grove)', '185 Bray Station - Enniskerry', '69X Rathlawns (Green Lane) - Poolbeg Street', '65 - Valleymount Road - Poolbeg Street', '39X Delhurst Estate - Burlington Road (Mespil Road)', '38B Damastown Drive - Burlington Road (Mespil Road)', "122 Drimnagh Road (Our Lady's Hospital for Sick Children) - Ashington Gardens", '7A Mountjoy Square Park - Loughlinstown Wood Estate', '536 Naomh Barrog GAA - Finglas Village', '41D Swords Business Park - Marlborough Street', '39X Burlington Road (Mespil Road) - Ongar Road (Hansfield Road)', '161 - Rockbrook - Dundrum', '15B Merrion Square South - Dalriada Estate', '41 Marlborough Street - Abbeyvale Estate', 'L54 Red Cow Luas - River Forest', '17 Rialto - Blackrock', '145 Kilmacanogue (Esso Garage) - Outside Heuston Train Station', '41B Rolestown Cottages - Marlborough Street', '16 Dublin Airport - Kingston Estate', '37 Wilton Terrace - Shopping Centre', '116 Sussex Road - Church of Our Lady of Good Council', '75 Dún Laoghaire - The Square Tallaght', '104 Bus Stop at Train Station - Hastings Green Roundabout', '54A Trinity College - Kiltipper Way', '46A Outside Train Station - Phoenix Park Gate', '130 - Talbot Street - Clontarf Castle', "11 Blackthorn Road - Saint Pappin's Road", '49 Fortunestown Road - Trinity College', '76 Chapelizod - Tallaght', 'H1 Baldoyle Village - National Lottery Head Quarters', '40 - Liffey Valley SC - Charlestown Centre', '42 Wendell Avenue - Talbot Street (opp Bank of Ireland)', '238 Tyrellstown - Blanchardstown', 'H2 National Lottery Head Quarters - Malahide Garda Station', '33X Northcliffe Heights - Merrion Square West', '15D Merrion Square South - Church of Our Lady of Good Council', "111 - Bride's Glen - Dalkey", '761 - Tallaght - Chapelizod', '47 Poolbeg Street - Castlethorn Estate', '114 Blackrock Station - Rockview', '15A Merrion Square South - Limekiln Avenue', '104 Hastings Green Roundabout - Bus Stop at Train Station', '41C Marlborough Street - Abbeyvale Estate', 'L59 River Forest - Hazelhatch Station', '65B Bianconi Avenue - Poolbeg Street', '123 Griffith Avenue (Malahide Road) - Kilnamanagh Road', 'X27 University College Dublin - Salesian College', '17 Blackrock - Rialto', '4 - Monkstown Fitness Centre - Harristown Bus Garage', '27A Liberty Hall - Blunden Drive', '83 Harristown Bus Garage - Stannaway Court', "150 Hawkin's Street - Orwell Road", '761 - Chapelizod - Tallaght', '751 The Square Tallaght - Dún Laoghaire', 'L58 River Forest - Hazelhatch Station', '63 Dún Laoghaire - Kilternan', '7D Mountjoy Square - Castle Street', 'L54 River Forest - Red Cow Luas', '951 Liffey Valley SC - Adamstown Station', '27X University College Dublin - Clare Hall Estate (Templeview Avenue)', 'H3 Howth Summit - National Lottery Head Quarters', '46E Outside Train Station - Mountjoy Square', '39A Delhurst Estate - University College Dublin', '44 The Helix - Enniskerry Village', '27A Naomh Barrog GAA Club - Eden Quay', '40D The Gate Hotel - The Oaks', '39A University College Dublin - Ongar Road (Hansfield Road)', '6 Outside Train Station - National Lottery Head Quarters', '33E Irish Life Mall - Northcliffe Heights', '41 Abbeyvale Brackenstown Road - Marlborough Street', '68A Bulfin Road - Poolbeg Street', '452 Kilmacanogue - Dún Laoghaire', '185 Enniskerry -Bray Station', "C1 Saint John's Church - Outside Train Station", '83 Stannaway Court - Charlestown Shopping Centre', '26 Liffey Valley SC - Merrion Square South', '952 Adamstown Station - Blanchardstown SC', '32X University College Dublin - Swords Road (Millview)', '33 Irish Life Mall - Church', "C1 Outside Train Station - Saint John's Church", '238 Blanchardstown - Tyrellstown', "33 Saint Paul's Crescent - Irish Life Mall", '40D The Oaks - Marlborough Street', '1 -  Shaw Street - Shanard Road (Shanard Avenue)', '40B River Meade Avenue - Marlborough Street', '9 Greenhills College - Charlestown Shopping Centre', '33X Custom House Quay - Church', '32X Swords Road (Lawson Spinney) - University College Dublin', 'H1 National Lottery Head Quarters - Old Race Course', '161 - Dundrum - Rockbrook', 'X25 University College Dublin - Kingsbury Estate', '43 Talbot Street (opp Bank of Ireland) - Swords Business Park', '52 - Ringsend Road - Intel Campus 1', '18 Sandymount - Palmerstown', '27 Fortunestown Road - Templeview Avenue', '27B Harristown Bus Garage - Eden Quay', '75 The Square Tallaght  - Dún Laoghaire', '76 Tallaght  - Chapelizod', '56A Tallaght Luas - Barrow Street', '38A Burlington Road (Mespil Road) - Damastown Drive', "15 Main Street - Ballycullen Road (Hunter's Avenue)", '84X Trinity College - Newcastle Road (Sea Road)', '42 Talbot Street (opp Bank of Ireland) - Coast Road', "140 Palmerston Park - Saint Margaret's Road", '151 Foxborough Estate - Bargy Road', '114 Rockview - Blackrock Station', '84 Temple Road - Newcastle Road (Sea Road)', '150 Orwell Road - Hawkin House', '79 Aston Quay - Spiddal Park', '59 Dún Laoghiaire - Killiney Hill', '39 Burlington Road (Mespil Road) - Ongar Road (Hansfield Road)', '38D Damastown Drive - Burlington Road (Mespil Road)', '41X University College Dublin - Knocksedan', '102 Sutton Station - Dublin Airport', '33D Smarts Lane - Huguenot Cemetery', '751 Dún Laoghaire - The Square Tallaght', '27 Templeview Avenue - Fortunestown Road', '79A Aston Quay - Park West Hotel', '43 Jugback Lane - Talbot Street (opp Bank of Ireland)', 'X28 Salesian College - Lower Leeson Street', '40E Broombridge Luas - Carlton Hotel', '68 Greenoge - Poolbeg Street', '40 - Charlestown Shopping Centre - Liffey Valley SC',
                       '38B Burlington Road (Mespil Road) - Damastown Drive', '38D Burlington Road (Mespil Road) - Damastown Drive', '18 Palmerstown- Sandymount', 'H3 National Lottery Head Quarters - Howth Summit', 'X30 Dodsboro Road - University College Dublin', 'P29 Outside Train Station - Barrow Street', 'L59 Hazelhatch Station - River Forest', "68A Hawkin's Street - Bulfin Road", '7B Mountjoy Square - Beechfield Manor', '16D -  Shanard Road (Shanard Avenue) - Shaw Street', '120 - Merrion Road RDS - River Road', '47 Belarmine Plaza - Poolbeg Street', '16 Kingston Estate - Dublin Airport', '41C Abbeyvale Brackenstown Road - Marlborough Street', '37 Shopping Centre - Wilton Terrace', '952 Blanchardstown SC - Adamstown Station', '4 - Harristown Bus Garage - Monkstown Avenue (Richmond Grove)', '77X Bianconi Avenue - University College Dublin', 'C4 Straffan Road - Barrow Street', 'N4 Point Village - Shopping Centre', '84 Sea Road - Temple Road', '46A Phoenix Park Gate - University College Dublin', '49 Trinity College - Tallaght, The Square Shopping Centre', '16D -  Shaw Street - Shanard Road (Shanard Avenue)', "11 Saint Pappin's Road - Blackthorn Drive (Blackthorn Road)", '51D Aston Quay - Woodford Hill', 'X32 Earlsfort Terrace - Hewlett Packard', '116 Church of Our Lady of Good Council - Parnell Square North', '7B Beechfield Manor - Mountjoy Square', 'C6 Ringsend Road - Straffan Road', 'X26 Straffan Road (Kingsbury Estate) - Lower Leeson Street', '61 Eden Quay - Edmondstown Road (Rockbrook Park School)', '118 Enniskerry Road (Ballycorus Rd) - Eden Quay', '77A Bianconi Avenue - Barrow Street', 'X30 University College Dublin - The Paddocks Drive', '41B Marlborough Street - Cemetery', '44 Enniskerry Village - The Helix', '331 Dublin Airport - Balbriggan', "155 Outside Train Station - St.Margaret's Road", 'X28 University College Dublin - Salesian College', '175 - UCD - Citywest', "7 Mountjoy Square Park - Bride's Glen Bus Stop", 'L58 Hazelhatch Station - River Forest', '84A Outside Train Station - Temple Road', "7 Bride's Glen Bus Stop - Mountjoy Square", '79A Park West Hotel - Aston Quay', '120 - Rathbourne Avenue - Marlborough Street', '61 Edmondstown Road (Rockbrook Park School) - Eden Quay', '54A Marlfield Estate - Trinity College', '15D Whitechurch Green - Merrion Square South', '39 Delhurst Estate - Burlington Road (Mespil Road)', '951 Adamstown Station - Liffey Valley SC', '65 - Rockbrook - Dundrum', '122 Ashington Park - Errigal Rd', '83A Harristown Bus Garage - Stannaway Court', '44B Outside Luas Station - Hill View', '40E Carlton Hotel - Broombridge Luas', '27B Liberty Hall - Harristown Bus Garage', 'C5 Ringsend Road - Hayfield', 'C3 Hayfield - Barrow Street', '84X Sea Road - Eden Quay', '65 - Poolbeg Street - Valleymount Road', '84A Temple Road - Outside Train Station', '331 Balbriggan - Dublin Airport', "155 St.Margaret's Road - Outside Train Station", '142 University College of Dublin UCD - Coast Road', '26 Merrion Square South - Liffey Valley SC', "X31 River Forest - Saint Stephen's Green House", '52 - Intel Campus 1 - Barrow Street', "C2 Saint John's Church - Outside Train Station", 'N4 Shopping Centre - Point Village', '452 Dún Laoghaire - Kilmacanogue', '40B The Gate Hotel - River Meade Avenue', 'L53 Outside Train Station - Liffey Valley SC', '7D Castle Street - Mountjoy Square', '53 Talbot Street (opp Bank of Ireland) - Irish Ferries Terminal', '16D Dublin Airport - Kingston Estate', "69X Hawkin's Street - Community School", "111 - Dalkey - Bride's Glen", '44B Hill View - Outside Luas Station', 'X31 Earlsfort Terrace - River Forest', 'P29 Ringsend Road - Outside Train Station', '41D Marlborough Street - Swords Business Park', '15A Greenhills College - Merrion Square South', '63 Kilternan - Dún Laoghaire', "C2 Outside Train Station - Saint John's Church", '79 Spiddal Park - Aston Quay', '56A Ringsend Road - Tallaght Luas', "15 Ballycullen Road (Hunter's Avenue) - Park and Ride Car Park", '38 Damastown Drive - Burlington Road (Mespil Road)', '9 Charlestown Shopping Centre - Greenhills College', '7A Loughlinstown Wood Estate - Mountjoy Square', '123 Kilnamanagh Road - Griffith Avenue (Malahide Road)', '38 Burlington Road (Mespil Road) - Damastown Drive', '6 National Lottery Head Quarters - Outside Train Station', 'C3 Ringsend Road - Hayfield', 'C5 Hayfield - Barrow Street', '102 Dublin Airport - Sutton Station', '142 Wendell Avenue - University College of Dublin UCD', "140 Saint Margaret's Road - Upper Rathmines Road", "H2 Saint James's Terrace - National Lottery Head Quarters", '83A Stannaway Court - Charlestown Shopping Centre', '130 - Saint John The Baptist Cemetery - Talbot Street', '151 Bargy Road - Foxborough Estate', "69 Hawkin's Street - Community School", '15B Dalriada Estate - Merrion Square South', 'C4 Ringsend Road - Straffan Road', '41X Knocksedan - University College Dublin', '1 -  Shanard Road (Shanard Avenue) - Shaw Street', '145 Outside Heuston Train Station - Kilmacanogue', '59 Killiney Hill - Dún Laoghaire', 'X27 Salesian College - Lower Leeson Street', '77A Ringsend Road - Bianconi Avenue', "X32 Alensgrove - Saint Stephen's Green House", '175 - Citywest - UCD', '27X Templeview Avenue - University College Dublin', '51D Watery Lane - Waterloo Road (Wellington Lane)', '69 Rathlawns (Green Lane) - Poolbeg Street', '65B Poolbeg Street - Bianconi Avenue', 'L53 Liffey Valley SC - Outside Train Station', 'X25 Straffan Road (Kingsbury Estate) - University College Dublin', '14 - Maryfield Drive - Outside Luas Station', '38A Damastown Drive - Burlington Road (Mespil Road)', '33D Custom House Quay - Smarts Lane', '53 Irish Ferries Terminal - Talbot Street (opp Bank of Ireland)', "68 Hawkin's Street - Greenoge"]

        return JsonResponse(route_names, safe=False)

# Coding algorithm
# _P10_ == '('
# _P01  == ')'
# _D01_ == '-'
# _ == " "
# _Q01_ == "\'"


class Prediction(APIView):

    @csrf_exempt
    @api_view(['POST'])
    def prediction(request, format=None):

        # fetch the weather data used for prediction
        def getweather():
            api_key = '73a101f4fbf0526cd7f3ece2d8e7c025'
            lat = 53.350140
            lon = -6.266155
            exclude = 'daily,minutely,hourly,alerts'
            url = f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={exclude}&appid={api_key}'

            response = requests.get(url)

            weather_data = response.json()

            wind_g = 0
            rain_1h = 0

            if 'wind_gust' in weather_data['current']:
                wind_g = weather_data['current']['wind_gust']

            if 'rain' in weather_data['current']:
                if '1h' in weather_data['current']['rain']:
                    rain_1h = weather_data['current']['rain']['1h']

            temp = weather_data['current']['temp']
            wind_s = weather_data['current']['wind_speed']

            return temp, wind_s, rain_1h, wind_g

        dictionary_old = {

            # Need extra info
            "DIRECTION": 1,

            # Search from MongoDB
            "PROGRNUMBER": 25,

            # GTFS-R ?
            "PLANNED_TRIPTIME(s)": 3317,

            # Local time || From google api
            "HOUROFDAY": 18.0,
            "DAYOFWEEK": 3,
            "MONTHOFYEAR": 2,

            # Open weather api
            "temp": 3,
            "wind_speed": 9.3,
            "rain_1h": 0,
        }

        dictionary_new = {

            'stop_sequence': 15,
            'hour_of_day': 8,
            'day_of_week': 5,
            'month_of_year': 8,
            'temp': 23,
            'rain': 0
        }

        client = MongoClient(
            'mongodb+srv://Nalced7:Nalced997@cluster0.25zfifd.mongodb.net/?retryWrites=true&w=majority')

        db = client['routex']

        # fetch the program number from MongoDB
        def getP_number(stop, route_db):

            print(stop)
            print(stop.split(', ')[0])

            cursor = route_db.find(
                {'STOPNAME': {'$regex': stop.split(', ')[0]}}, {'_id': False})

            stop_sequence = 1
            direction = 1

            value = cursor.next()
            print(value)
            stop_sequence = value['stop_sequence']
            direction = value['directionid']

            direction += 1

            print(stop_sequence)
            print(direction)

            return stop_sequence, direction

        if(request):

            # load the post request data
            data = request.body
            results = json.loads(data.decode())
            print(results)

            # get direction & P number & stopID
            time_prediction = []
            # Get the first element in result
            for result in results:

                start = result['start']
                end = result['end']
                route_number = result['routeNumber']
                headsign = result['name']

                print(start)
                print(end)
                print(route_number)
                print(headsign)

                route = db[str(route_number) + ' ' + headsign]
                print(route)
                # Try find the matched route in database
                if(route.count_documents({}) == 0):
                    return Response({'Bad Request': 'no matched route'}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    stop_sequence_S, direction_S = getP_number(start, route)
                    print(stop_sequence_S)
                    stop_sequence_E = stop_sequence_S + result['stopNumber']

                except:
                    try:
                        stop_sequence_E, direction_S = getP_number(end, route)
                        print(stop_sequence_E)
                        if(stop_sequence_E < result['stopNumber']):
                            stop_sequence_S = stop_sequence_E + \
                                result['stopNumber']
                        else:
                            stop_sequence_S = stop_sequence_E - \
                                result['stopNumber']
                    except:
                        return Response({'Bad Request': 'no matched stops'}, status=status.HTTP_400_BAD_REQUEST)

                dictionary_old['PROGRNUMBER'] = stop_sequence_S
                dictionary_old['DIRECTION'] = direction_S

                # get the weather data
                temp, wind_s, rain_1h, wind_g = getweather()

                # Get the planned trip time
                df = pd.read_csv('estimated_trip_time_new.csv')
                day_time = result['HOUROFDAY']
                df_temp = df[(df['trip_headsign'] == headsign)
                             & (df['hour_of_day'] == day_time)]

                # print(df_temp)

                time = df_temp['estimated_trip_time'].mean()
                print(time)

                # read the planned trip time from static csv
                if(math.isnan(time)):
                    return Response({'Bad Request': 'no planned trip times'}, status=status.HTTP_400_BAD_REQUEST)

                # return error code when our model does not match the navigation from google

                dictionary_old['PLANNED_TRIPTIME(s)'] = time
                dictionary_old['HOUROFDAY'] = result['HOUROFDAY']
                dictionary_old['DAYOFWEEK'] = result['DAYOFWEEK']
                dictionary_old['MONTHOFYEAR'] = result['MONTHOFYEAR']
                dictionary_old['temp'] = temp
                dictionary_old['wind_speed'] = wind_s
                dictionary_old['rain_1h'] = rain_1h

                dictionary_new['stop_sequence'] = stop_sequence_S
                dictionary_new['hour_of_day'] = result['HOUROFDAY']
                dictionary_new['day_of_week'] = result['DAYOFWEEK']
                dictionary_new['temp'] = temp
                dictionary_new['rain'] = rain_1h

                Pname = str(route_number)

                print(dictionary_old)
                print(dictionary_new)
                # testing code
                # result['headsign'] = 'Bray'
                # Pname = str(155)
                # pickle loading
                if(path.exists('./pickles/PickleFiles_' + Pname + '.pkl')):
                    print('Using old model')
                    var_old = pd.DataFrame([dictionary_old])
                    file = open('./pickles/PickleFiles_' +
                                Pname + '.pkl', 'rb')
                    loaded_model = pickle.load(file)

                    result_S = loaded_model.predict(var_old)

                    var_old.PROGRNUMBER = stop_sequence_E

                    result_E = loaded_model.predict(var_old)

                    print(result_S)
                    print(result_E)

                    file.close()

                    time_prediction.append(abs(result_E - result_S))

                elif(path.exists('./pickles/PickleFiles_' + Pname + '_' + result['headsign'] + '.pkl')):
                    print('Using new model')
                    var_new = pd.DataFrame([dictionary_new])
                    file = open('./pickles/PickleFiles_' + Pname +
                                '_' + result['headsign'] + '.pkl', 'rb')

                    loaded_model = pickle.load(file)

                    result_S = loaded_model.predict(var_new)

                    var_new.stop_sequence = stop_sequence_E

                    result_E = loaded_model.predict(var_new)

                    print(result_S)
                    print(result_E)

                    file.close()

                    time_prediction.append(abs(result_E - result_S))
                else:
                    print("Using google's prediction")
                    return Response({'Bad Request': 'No pickefile founded'}, status=status.HTTP_400_BAD_REQUEST)

                print(time_prediction)

            return Response(time_prediction, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Invalid data submitted'}, status=status.HTTP_400_BAD_REQUEST)
