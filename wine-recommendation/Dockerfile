FROM python:3.9
RUN mkdir /usr/src/app/
COPY . /usr/src/app/
WORKDIR /usr/src/app/
EXPOSE 4000
RUN pip install pip --upgrade
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
