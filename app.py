from flask import *
import mysql.connector
import json
from collections import OrderedDict
import jwt
import datetime
from datetime import datetime as dt_datetime 
from datetime import datetime as posttime 

import requests
from jwt import ExpiredSignatureError, InvalidTokenError


app=Flask(__name__)
app.debug = True

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/application")
def application():
    return render_template("application.html")


@app.route('/api/user', methods=["POST"])
def signup():
    con = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root1234",
        database="simp"
    )
    # 從name中抓取位置獲取資料
    signupName = request.form["signupName"]
    signupEmail = request.form["signupEmail"]
    signupPassword = request.form["signupPwd"]

    cursor = con.cursor()

    cursor.execute("SELECT * FROM membership WHERE memberEmail = %s", (signupEmail,))
    existing_user = cursor.fetchone()

    if existing_user:
        con.close()
        signup_error_response = {"error": True, "message": "這個電子郵箱已經被使用!"}
        return jsonify(signup_error_response), 400
    try:
        cursor.execute("INSERT INTO membership (memberId, memberEmail, memberPwd) VALUES (%s, %s, %s)",
                       (signupName, signupEmail, signupPassword))
        con.commit()
        con.close()
        signup_success_response = {"ok": True, "message": "註冊成功"}
        return jsonify(signup_success_response), 200
    except Exception as e:
        con.close()
        signup_error_response = {"error": True, "message": "註冊失敗"}
        return jsonify(signup_error_response), 500

@app.route('/api/user/auth', methods=["PUT"])
def signin():
    try:
        con = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root1234",
            database="simp"
        )
        signinEmail = request.form["signinEmail"]
        signinPassword = request.form["signinPwd"]
        cursor = con.cursor()

        cursor.execute("SELECT * FROM membership WHERE memberEmail = %s AND memberPwd =%s" , (signinEmail, signinPassword))
        signinMembership = cursor.fetchall()
        for signinRow in signinMembership:
            if signinRow[2] == signinEmail and signinRow[3] == signinPassword:
                user_info = {
                   "id": signinRow[0],
                   "name": signinRow[1],
                   "email": signinRow[2]
                }
                expiration_time = datetime.datetime.utcnow() + datetime.timedelta(days=7)
                secret_key = "My_secret_key"
                token = jwt.encode({"data": user_info, "exp": expiration_time}, secret_key, algorithm="HS256")
                return jsonify({"token": token})
        return jsonify({"error":True, "message":"電子郵件或密碼錯誤"}), 400 
    except Exception as e:
        signin_error_response = {
        "error": True,
        "message": "請按照情境提供對應的錯誤訊息"
        }
        return jsonify(signin_error_response), 500 

def authenticate_token(f):
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        secret_key = "My_secret_key"
        if token is None:
            return jsonify(data=None)
        
        token_parts = token.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            return jsonify(data=None)
        
        jwt_token = token_parts[1]
        
        try:
            decode_token = jwt.decode(jwt_token, secret_key, algorithms=["HS256"])
            token_user_info = decode_token.get("data", None)
            if token_user_info is None:
                return jsonify(data=None)
            return jsonify(data=token_user_info)
        except jwt.ExpiredSignatureError:
            return jsonify(data=None), 400
        except jwt.InvalidTokenError as e:
            return jsonify(data=None), 400
    return decorated

@app.route("/api/user/auth", methods=["GET"])
@authenticate_token
def user_auth(current_user):
    return jsonify(data=current_user)

@app.route("/api/jobPost", methods=["GET"])
def getJobPost():
    con = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root1234",
    database="simp"
    )

    cursor = con.cursor()
    query = "SELECT * FROM jobs"
    cursor.execute(query)


    result = cursor.fetchall()

        # Convert the result to a list of dictionaries for JSON serialization
    job_posts = []
    for row in result:
        job_post = {
            'job_title': row[2],
            'job_description': row[3],
            'job_date':row[4],
            'job_start_time':row[5],
            'job_end_time':row[6],
            'job_zipcode':row[7],
            'job_city':row[8],
            'job_location':row[9],
            'job_salary':row[10],
            'job_others':row[11],
            'number_of_job_positions':row[12],
            'post_time':row[13],
            'pay_date':row[14],
            'pay_method':row[15]
        }
        job_posts.append(job_post)

    # Close the database connection
    cursor.close()
    con.close()

    # Return the result as JSON
    return jsonify(job_posts)



@app.route('/api/jobPost', methods=["POST"])
def updateJobPost():
    con = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root1234",
        database="simp"
    )

    jobTitle = request.form["jobTitle"]
    jobDetail = request.form["jobDetail"]
    jobDate = request.form["jobDate"]
    jobStartTime = request.form["jobStartTime"]
    jobEndTime = request.form["jobEndTime"]
    jobZipcode = request.form["jobZipcode"]
    jobCity = request.form["jobCity"]
    jobLocation = request.form["jobLocation"]
    jobSalary = request.form["jobSalary"]
    jobOthers = request.form["jobOthers"]
    payDates = request.form["payDate"]
    paymentMethod = request.form["paymentMethod"]
    numberOfJobPositions = request.form["numberOfJobPositions"]
    # Format to get only the year, month, and day
    current_time = posttime.now()
    formatted_date = current_time.strftime("%Y-%m-%d")
    postTime = formatted_date 
    

    cursor = con.cursor()

    token = request.headers.get("Authorization")

    try:
        if not token or not token.startswith("Bearer "):
            raise InvalidTokenError("Invalid or missing token")

        jwt_token = token.split(" ")[1]
        secret_key = "My_secret_key"

        decode_token = jwt.decode(jwt_token, secret_key, algorithms=["HS256"])
        token_user_info = decode_token.get("data", None)
        user_email = token_user_info['email']

        # Insert the job post into the database
        cursor.execute("INSERT INTO jobs (memberEmail, title, detail, jobDate, start_time, end_time, zipcode, city, location, salary, jobOthers, numberOfJobPositions, postTime, payDates, paymentMethod) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s , %s, %s, %s, %s)",
                       (user_email, jobTitle, jobDetail, jobDate, jobStartTime, jobEndTime, jobZipcode, jobCity, jobLocation, jobSalary, jobOthers, numberOfJobPositions, postTime, payDates, paymentMethod))
        con.commit()
        con.close()

        response_data = {"ok": True, "message": "刊登成功", "token": token}
        return jsonify(response_data), 200
    except Exception as e:
        con.rollback()
        con.close()
        erro_response_data = {"error": True, "message": "刊登失敗", "token": token}
        return jsonify({erro_response_data}), 500


app.run()